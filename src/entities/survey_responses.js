import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "SurveyResponse",
  tableName: "survey_responses",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    surveyId: {
      type: "int",
    },
    answers: {
      type: "simple-json",
    },
    respondent: {
      type: "varchar",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    survey: {
      type: "many-to-one",
      target: "Survey",
      joinColumn: {
        name: "surveyId",
      },
      onDelete: "CASCADE",
      inverseSide: "responses",
    },
  },
});
