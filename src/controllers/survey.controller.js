import { AppDataSource } from "../config/configDb.js";
import SurveyResponse from "../entities/survey_responses.js";
import Survey from "../entities/survey.entity.js";
import { handleSuccess, handleErrorServer } from "../Handlers/responseHandlers.js";

export const createSurvey = async (req, res) => {
    const {title, description, questions} = req.body;
    if (!title || !Array.isArray(questions) || questions.length === 0) {
        return handleErrorServer(res, "titulo y preguntas son obligatorios");
    }

    try {
        if (AppDataSource?.isInitialized) {
            const repo = AppDataSource.getRepository(Survey);
            const survey = repo.create({ title, description, questions });
            await repo.save(survey);
            return handleSuccess(res, 201, "Encuesta creada exitosamente", { survey });
        } else {
            return handleErrorServer(res, "Error interno");
        }
    } catch (error) {
        return handleErrorServer(res, error);
    }
};

export const listSurveys = async (req, res) => {
    try {
        if (AppDataSource?.isInitialized) {
            const repo = AppDataSource.getRepository(Survey);
            const surveys = await repo.find({order: { created_at: "DESC" }});
            return handleSuccess(res, 200, "Encuestas obtenidas exitosamente", { surveys });
        } else {
            return handleErrorServer(res, "Error interno");
        }
    } catch (error) {
        return handleErrorServer(res, error);
    }
};

export const submitSurveyResponse = async (req, res) => {
    const { id } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
        return handleErrorServer(res, "Respuestas son obligatorias");
    }

    try {
        if (AppDataSource?.isInitialized) {
            const surveyRepo = AppDataSource.getRepository(Survey);
            const survey = await surveyRepo.findOne({ where: { id } });

            if (!survey) {
                return handleErrorServer(res, "Encuesta no encontrada");
            }

            const responseRepo = AppDataSource.getRepository(SurveyResponse);
            const surveyResponse = responseRepo.create({
                surveyId: survey.id,
                answers,
                respondent: req.user.sub
            });
            await responseRepo.save(surveyResponse);
            return handleSuccess(res, 201, "Respuestas enviadas exitosamente", { surveyResponse });
        } else {
            return handleErrorServer(res, "Error interno");
        }
    } catch (error) {
        return handleErrorServer(res, error);
    }
};
