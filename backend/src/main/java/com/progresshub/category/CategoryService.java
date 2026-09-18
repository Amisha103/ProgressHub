package com.progresshub.category;

import com.progresshub.category.dto.CreateCategoryRequest;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            UserRepository userRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public Category createCategory(
            String userEmail,
            CreateCategoryRequest request
    ) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Category category = new Category();

        category.setName(request.getName());
        category.setUser(user);

        return categoryRepository.save(category);
    }
}