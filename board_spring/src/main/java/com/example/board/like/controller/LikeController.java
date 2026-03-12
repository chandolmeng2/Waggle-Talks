package com.example.board.like.controller;

import com.example.board.user.domain.User;
import com.example.board.user.service.UserService;
import com.example.board.like.service.LikeService;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class LikeController {

	private final LikeService likeService;
	private final UserService userService;

private Map<String, Object> buildLikeResponse(Long postId, User user) {
    int likeCount = likeService.getLikeCountByPostId(postId);
    int dislikeCount = likeService.getDislikeCountByPostId(postId);

    boolean liked = false;
    boolean disliked = false;

    if (user != null) {
        liked = likeService.isPostLikedByUser(postId, user);
        disliked = likeService.isPostDislikedByUser(postId, user);
    }

    Map<String, Object> response = new HashMap<>();
    response.put("likeCount", likeCount);
    response.put("dislikeCount", dislikeCount);
    response.put("likedByUser", liked);
    response.put("dislikedByUser", disliked);
    return response;
}

@GetMapping("/{postId}/likes-status")
public Map<String, Object> getLikesStatus(
        @PathVariable("postId") Long postId,
        @AuthenticationPrincipal UserDetails userDetails) {

    User user = null;
    if (userDetails != null) {
        user = userService.findByUsername(userDetails.getUsername());
    }

    int likeCount = likeService.getLikeCountByPostId(postId);
    int dislikeCount = likeService.getDislikeCountByPostId(postId);

    boolean liked = false;
    boolean disliked = false;

    if (user != null) {
        liked = likeService.isPostLikedByUser(postId, user);
        disliked = likeService.isPostDislikedByUser(postId, user);
    }

    Map<String, Object> response = new HashMap<>();
    response.put("likeCount", likeCount);
    response.put("dislikeCount", dislikeCount);
    response.put("likedByUser", liked);
    response.put("dislikedByUser", disliked);

    return response;
}
	@PostMapping("/{postId}/like")
	public Map<String, Object> like(
			@PathVariable("postId") Long postId,
			@AuthenticationPrincipal UserDetails userDetails) {

		User user = userService.findByUsername(userDetails.getUsername());
		likeService.toggleLike(postId, user, true);
		return buildLikeResponse(postId, user);
	}

	@PostMapping("/{postId}/dislike")
	public Map<String, Object> dislike(
			@PathVariable("postId") Long postId,
			@AuthenticationPrincipal UserDetails userDetails) {

		User user = userService.findByUsername(userDetails.getUsername());
		likeService.toggleLike(postId, user, false);
		return buildLikeResponse(postId, user);
	}

	@PostMapping("/{postId}/like/cancel")
	public Map<String, Object> cancelLike(
			@PathVariable("postId") Long postId,
			@AuthenticationPrincipal UserDetails userDetails) {

		User user = userService.findByUsername(userDetails.getUsername());
		likeService.cancelLike(postId, user);
		return buildLikeResponse(postId, user);
	}

	@PostMapping("/{postId}/dislike/cancel")
	public Map<String, Object> cancelDislike(
			@PathVariable("postId") Long postId,
			@AuthenticationPrincipal UserDetails userDetails) {

		User user = userService.findByUsername(userDetails.getUsername());
		likeService.cancelDislike(postId, user);
		return buildLikeResponse(postId, user);
	}
}