package com.progresshub.category;

import com.progresshub.category.dto.CreateCategoryRequest;
import com.progresshub.user.User;
import com.progresshub.user.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import com.progresshub.user.User;
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
    public List<Category> getCategories(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return categoryRepository.findByUserId(user.getId());
    }

    public Category updateCategory(
            String userEmail,
            Long categoryId,
            CreateCategoryRequest request
    ) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Category category = categoryRepository
                .findByIdAndUserId(categoryId, user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found")
                );

        category.setName(request.getName());

        return categoryRepository.save(category);
    }
    public void deleteCategory(
            String userEmail,
            Long categoryId
    ) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Category category = categoryRepository
                .findByIdAndUserId(categoryId, user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found")
                );

        categoryRepository.delete(category);
    }
}