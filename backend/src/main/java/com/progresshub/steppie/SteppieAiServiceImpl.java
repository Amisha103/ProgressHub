
package com.progresshub.steppie;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SteppieAiServiceImpl implements SteppieAiService {

    @Override
    public List<SteppieStep> generateRoadmap(String goal) {
        throw new UnsupportedOperationException(
                "AI roadmap generation is not implemented yet"
        );
    }
}
