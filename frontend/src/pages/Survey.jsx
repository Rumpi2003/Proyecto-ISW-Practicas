import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSurveyById } from "../services/survey.service.js";

export default function Survey() {
  // Cambia aquí el ID de la encuesta que quieres cargar directamente en el código
  const SURVEY_ID = "2"; // p.ej. "1" o "a1b2c3..."
  const id = SURVEY_ID;

  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [answersState, setAnswersState] = useState({});

  useEffect(() => {
    const fetchSurvey = async () => {
      if (!id) {
        setError("ID de encuesta no proporcionado");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Usar el id definido arriba en lugar de useParams
        const data = await getSurveyById(id);
        console.debug("getSurveyById response:", data);

        // Soportar varias formas de respuesta: { survey }, { data: { survey } }, survey directamente, etc.
        const resolved =
          data?.survey ?? data?.data?.survey ?? data?.data ?? data ?? null;

        if (!resolved) throw new Error("Respuesta de API inesperada");

        // Si el resolved incluye otras keys, intentar extraer survey
        const finalSurvey = resolved?.survey ? resolved.survey : resolved;

        if (!finalSurvey) throw new Error("Encuesta no encontrada en la respuesta");

        setSurvey(finalSurvey);
      } catch (err) {
        console.error("Error cargando encuesta:", err);
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id]);

  useEffect(() => {
    if (survey?.questions && answersState && Object.keys(answersState).length === 0) {
      // inicializa con valores vacíos
      const initial = {};
      (survey.questions || []).forEach((q) => {
        if (q.type === "multiple") initial[q.id] = [];
        else initial[q.id] = "";
      });
      setAnswersState(initial);
    }
  }, [survey]);

  const handleTextChange = (questionId, value) => {
    setAnswersState((s) => ({ ...s, [questionId]: value }));
  };

  const handleSingleChange = (questionId, value) => {
    setAnswersState((s) => ({ ...s, [questionId]: value }));
  };

  const handleMultipleChange = (questionId, optionValue, checked) => {
    setAnswersState((s) => {
      const prev = Array.isArray(s[questionId]) ? s[questionId].slice() : [];
      if (checked) {
        if (!prev.includes(optionValue)) prev.push(optionValue);
      } else {
        const idx = prev.indexOf(optionValue);
        if (idx >= 0) prev.splice(idx, 1);
      }
      return { ...s, [questionId]: prev };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const answers = (survey.questions || []).map((q) => {
      const raw = answersState[q.id];
      return { questionId: q.id, answer: raw };
    });

    try {
      const base = import.meta.env.DEV ? "" : ""; // ajustar si necesitas prefijo API
      const res = await fetch(`${base}/surveys/${id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, respondent: "web_user" }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al enviar respuestas");
      }
      navigate("/thank-you");
    } catch (err) {
      console.error("Error enviando respuestas:", err);
      setError(err.message || "Error al enviar");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Cargando encuesta...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!survey) return <div>Encuesta no encontrada</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <h1>{survey.title}</h1>
      {survey.description && <p>{survey.description}</p>}

      <form onSubmit={handleSubmit}>
        {(survey.questions || []).map((q, idx) => (
          <div key={q.id ?? idx} style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: 6 }}>
              {q.text}
            </label>

            {q.type === "text" && (
              <textarea
                value={answersState[q.id] ?? ""}
                onChange={(e) => handleTextChange(q.id, e.target.value)}
                rows={3}
                style={{ width: "100%" }}
              />
            )}

            {q.type === "number" && (
              <input
                type="number"
                value={answersState[q.id] ?? ""}
                onChange={(e) => handleTextChange(q.id, e.target.value)}
                style={{ width: "100%" }}
              />
            )}

            {q.type === "single" && Array.isArray(q.options) && (
              <div>
                {q.options.map((opt) => (
                  <label key={opt} style={{ display: "block", marginBottom: 4 }}>
                    <input
                      type="radio"
                      name={String(q.id)}
                      value={opt}
                      checked={answersState[q.id] === opt}
                      onChange={() => setAnswersState((s) => ({ ...s, [q.id]: opt }))}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === "multiple" && Array.isArray(q.options) && (
              <div>
                {q.options.map((opt) => (
                  <label key={opt} style={{ display: "block", marginBottom: 4 }}>
                    <input
                      type="checkbox"
                      name={`${q.id}-${opt}`}
                      checked={Array.isArray(answersState[q.id]) && answersState[q.id].includes(opt)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setAnswersState((s) => {
                          const prev = Array.isArray(s[q.id]) ? [...s[q.id]] : [];
                          if (checked) {
                            if (!prev.includes(opt)) prev.push(opt);
                          } else {
                            const idx = prev.indexOf(opt);
                            if (idx >= 0) prev.splice(idx, 1);
                          }
                          return { ...s, [q.id]: prev };
                        });
                      }}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar respuestas"}
          </button>
        </div>
      </form>
    </div>
  );
}