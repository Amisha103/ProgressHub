
package com.progresshub.steppie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Schema;
import com.google.genai.types.Type;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SteppieAiServiceImpl implements SteppieAiService {

    private final String apiKey;
    private final ObjectMapper objectMapper;

    public SteppieAiServiceImpl(
            @Value("${GEMINI_API_KEY:}") String apiKey,
            ObjectMapper objectMapper) {
        this.apiKey = apiKey;
        this.objectMapper = objectMapper;
    }

    @Override
    public List<SteppieStep> generateRoadmap(String goal) {

        if (apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Gemini API key is missing"
            );
        }

        Client client = Client.builder()
                .apiKey(apiKey)
                .build();

        String prompt = """
                You are Steppie, a friendly and encouraging personal
                learning planner.

                Create a practical, beginner-friendly roadmap for:
                %s

                Divide the roadmap into 3 to 8 weeks.
                Each week should contain 2 to 4 meaningful steps.

                Every step must include:
                - weekNumber
                - stepOrder
                - title
                - description
                - estimatedMinutes

                Make the steps progressive and actionable.
                Include learning, practice and application.
                Keep descriptions clear and achievable.
                """.formatted(goal);

        Schema stepSchema = Schema.builder()
                .type(Type.Known.OBJECT)
                .properties(Map.of(
                        "weekNumber", Schema.builder()
                                .type(Type.Known.INTEGER)
                                .build(),
                        "stepOrder", Schema.builder()
                                .type(Type.Known.INTEGER)
                                .build(),
                        "title", Schema.builder()
                                .type(Type.Known.STRING)
                                .build(),
                        "description", Schema.builder()
                                .type(Type.Known.STRING)
                                .build(),
                        "estimatedMinutes", Schema.builder()
                                .type(Type.Known.INTEGER)
                                .build()
                ))
                .required(
                        "weekNumber",
                        "stepOrder",
                        "title",
                        "description",
                        "estimatedMinutes"
                )
                .build();

        Schema responseSchema = Schema.builder()
                .type(Type.Known.ARRAY)
                .items(stepSchema)
                .build();

        GenerateContentConfig config =
                GenerateContentConfig.builder()
                        .responseMimeType("application/json")
                        .responseSchema(responseSchema)
                        .build();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.8-flash",
                        prompt,
                        config
                );

        try {
            JsonNode stepsJson =
                    objectMapper.readTree(response.text());

            if (!stepsJson.isArray() || stepsJson.size() == 0) {
                throw new IllegalStateException(
                        "Gemini returned an empty roadmap"
                );
            }

            List<SteppieStep> steps = new ArrayList<>();

            for (JsonNode item : stepsJson) {

                SteppieStep step = new SteppieStep();

                step.setWeekNumber(
                        item.get("weekNumber").asInt()
                );

                step.setStepOrder(
                        item.get("stepOrder").asInt()
                );

                step.setTitle(
                        item.get("title").asText()
                );

                step.setDescription(
                        item.get("description").asText()
                );

                step.setEstimatedMinutes(
                        item.get("estimatedMinutes").asInt()
                );

                steps.add(step);
            }

            return steps;

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Failed to process the AI roadmap response",
                    e
            );
        }
    }
}
