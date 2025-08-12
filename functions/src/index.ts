import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import fetch from "node-fetch"; // Para hacer llamadas HTTP a Gemini
import nodemailer from "nodemailer";
import * as functions from "firebase-functions";


admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    
    user: process.env.CORREO_GMAIL_USER,
    pass: process.env.CORREO_GMAIL_PASSWORD,
   
  },
});


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_API_MODEL;


export const generarRespuestaIA = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Método no permitido");
    return;
  }

  try {
    const {
      fullName,
      email,
      identifycation,
      area,
      date,
      typeDescription,
      description,
    } = req.body;

    // Validación básica (igual que en tu Angular pero del lado servidor)
    if (
      !fullName ||
      !email ||
      !identifycation ||
      !area ||
      !date ||
      !typeDescription ||
      !description
    ) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
      return;
    }

    // Generar prompt para Gemini
    const prompt = `Como asistente de soporte, genera una respuesta útil en máximo 50 palabras para:
    - Tipo: ${typeDescription}
    - Descripción: ${description}
    Respuesta concisa:`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const geminiData: any = await geminiResponse.json();

    const respuestaIA =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Gracias por tu solicitud. Un administrador te contactará pronto.";

    // Guardar en Firestore
    const docRef = await admin.firestore().collection("solicitudes").add({
      fullName,
      email,
      identifycation,
      area,
      date,
      typeDescription,
      description,
      respuestaIA,
      fecha: admin.firestore.FieldValue.serverTimestamp(),
      estado: "nuevo",
    });

    res.status(200).json({
      id: docRef.id,
      respuesta: respuestaIA,
      mensaje: "Un administrador podría ajustar esta respuesta más tarde.",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error al procesar la solicitud",
      detalle: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});


// =====================
// MI END POINT PARA LISTAR SOLICITUDES - Function independiente
// =====================
export const listarSolicitudes = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "GET") {
    res.status(405).send("Método no permitido");
    return;
  }

  try {
    // Consultar solicitudes ordenadas por fecha más reciente
    const snapshot = await admin
      .firestore()
      .collection("solicitudes")
      .orderBy("fecha", "desc")
      .get();

    // Mapear los resultados con todos los campos nuevos
    const solicitudes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        fullName: data.fullName || "",
        email: data.email || "",
        identifycation: data.identifycation || "",
        area: data.area || "",
        date: data.date || "",
        typeDescription: data.typeDescription || "",
        description: data.description || "",
        respuestaIA: data.respuestaIA || "",
        estado: data.estado || "",
        fecha: data.fecha || null
      };
    });

    res.status(200).json({ solicitudes });
  } catch (error) {
    console.error("Error al listar solicitudes:", error);
    res.status(500).json({
      error: "Error al obtener las solicitudes",
      detalle: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});


// =====================
// MI END POINT PARA ACTALIZAR LA RESPUESTA - ENVIAR COREO
// =====================

export const actualizarRespuestaIA = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "PATCH, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "PATCH") {
    res.status(405).send("Método no permitido");
    return;
  }

  try {
    const { id, nuevaRespuesta } = req.body;

    if (!id || !nuevaRespuesta) {
      res.status(400).json({ error: "Faltan 'id' o 'nuevaRespuesta'" });
      return;
    }

    // Buscar la solicitud
    const docRef = admin.firestore().collection("solicitudes").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      res.status(404).json({ error: "Solicitud no encontrada" });
      return;
    }

    const solicitud = docSnap.data();

    // Actualizar respuestaIA en Firestore
    await docRef.update({
      respuestaIA: nuevaRespuesta,
      ultimaActualizacion: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Enviar correo al usuario
    if (solicitud?.email) {
      await transporter.sendMail({
        from: '"Soporte IT" <1hermescastro@gmail.com>',
        to: solicitud.email,
        subject: "Actualización de respuesta de soporte",
        text: `Hola ${solicitud.fullName},\n\nSe ha actualizado la respuesta a tu solicitud:\n\n${nuevaRespuesta}\n\nSaludos,\nEquipo de Soporte IT`,
      });
    }

    res.status(200).json({
      mensaje: "Respuesta actualizada y correo enviado",
      id,
      nuevaRespuesta,
    });
  } catch (error) {
    console.error("Error al actualizar respuesta:", error);
    res.status(500).json({
      error: "Error al actualizar la respuesta",
      detalle: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

// =====================
// MI END POINT PARA INICIAR SESIÓN - Login
// =====================
export const verificarToken = functions.https.onRequest(async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    res.status(403).send("No autorizado");
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.status(200).json({
      uid: decodedToken.uid,
      email: decodedToken.email
    });
  } catch (error) {
    res.status(403).send("Token inválido");
  }
});
