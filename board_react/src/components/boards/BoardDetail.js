import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spinner } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { TextField } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../contexts/AuthContext";

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const isAuthor =
    post && String(currentUser?.id) === String(post.author?.id);

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        setLoading(true);
        setCommentLoading(true);

        const [postRes, commentsRes, likesRes] = await Promise.all([
          axiosInstance.get(`/boards/${id}`),
          axiosInstance.get(`/boards/${id}/comments`),
          axiosInstance.get(`/posts/${id}/likes-status`),
        ]);

        setPost(postRes.data);
        setComments(commentsRes.data);

        setLikeCount(likesRes.data.likeCount ?? 0);
        setDislikeCount(likesRes.data.dislikeCount ?? 0);
        setLiked(likesRes.data.likedByUser ?? false);
        setDisliked(likesRes.data.dislikedByUser ?? false);
      } catch (error) {
        console.error("게시글 상세 조회 실패:", error);
      } finally {
        setLoading(false);
        setCommentLoading(false);
      }
    };

    fetchDetailData();
  }, [id]);

  const toggleLike = async () => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      let res;

      if (liked) {
        res = await axiosInstance.post(`/posts/${id}/like/cancel`);
        setLiked(false);
      } else {
        res = await axiosInstance.post(`/posts/${id}/like`, {
          userId: currentUser.id,
        });
        setLiked(true);
        setDisliked(false);
      }

      setLikeCount(res.data.likeCount ?? 0);
      setDislikeCount(res.data.dislikeCount ?? 0);
    } catch (error) {
      console.error("좋아요 처리 실패:", error?.response?.data || error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const toggleDislike = async () => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      let res;

      if (disliked) {
        res = await axiosInstance.post(`/posts/${id}/dislike/cancel`);
        setDisliked(false);
      } else {
        res = await axiosInstance.post(`/posts/${id}/dislike`);
        setDisliked(true);
        setLiked(false);
      }

      setLikeCount(res.data.likeCount ?? 0);
      setDislikeCount(res.data.dislikeCount ?? 0);
    } catch (error) {
      console.error("싫어요 처리 실패:", error?.response?.data || error);
      alert("싫어요 처리 중 오류가 발생했습니다.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axiosInstance.post(`/boards/${id}/comments`, {
        content: commentText,
      });
      setComments((prev) => [...prev, res.data]);
      setCommentText("");
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axiosInstance.delete(`/boards/${id}`);
      alert("삭제되었습니다.");
      navigate("/boards");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = () => {
    navigate(`/boards/${id}/edit`);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 정말 삭제하시겠습니까?")) return;

    try {
      await axiosInstance.delete(`/boards/${id}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentContent);
  };

  const handleSaveEditComment = async (commentId) => {
    if (!editingCommentText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    try {
      await axiosInstance.put(`/boards/${id}/comments/${commentId}`, {
        content: editingCommentText,
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: editingCommentText }
            : comment
        )
      );

      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Loading...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center mt-4 text-danger">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header
          as="h3"
          className="d-flex justify-content-between align-items-center"
        >
          <div>
            {post.title}
            <span
              style={{ fontSize: "1.2rem", color: "#666", marginLeft: "12px" }}
            >
              {post.createdAt?.slice(2, 10)}
            </span>
            {currentUser && (
              <span
                style={{
                  fontSize: "1rem",
                  color: "#007bff",
                  marginLeft: "20px",
                }}
              >
                (현재 사용자: {currentUser.username})
              </span>
            )}
          </div>

          {isAuthor && (
            <div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleEdit}
                className="me-2"
              >
                수정
              </Button>
              <Button variant="outline-danger" size="sm" onClick={handleDelete}>
                삭제
              </Button>
            </div>
          )}
        </Card.Header>

        <Card.Body>
          <Card.Text>{post.content}</Card.Text>

          {post.updatedAt && (
            <div className="text-muted">
              수정일: {new Date(post.updatedAt).toLocaleString()}
            </div>
          )}

          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => navigate("/boards")}
          >
            목록으로 돌아가기
          </Button>
        </Card.Body>
      </Card>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
          marginTop: "40px",
          marginBottom: "60px",
        }}
      >
        <Button
          variant={liked ? "primary" : "outline-primary"}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            fontSize: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
            boxShadow: liked ? "0 0 12px #0d6efd55" : undefined,
            transition: "box-shadow 0.2s",
          }}
          onClick={toggleLike}
        >
          <FaThumbsUp style={{ fontSize: "1.7rem" }} />
          <span style={{ fontSize: "1rem", fontWeight: 600 }}>{likeCount}</span>
        </Button>

        <Button
          variant={disliked ? "danger" : "outline-danger"}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            fontSize: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
            boxShadow: disliked ? "0 0 12px #dc354655" : undefined,
            transition: "box-shadow 0.2s",
          }}
          onClick={toggleDislike}
        >
          <FaThumbsDown style={{ fontSize: "1.7rem" }} />
          <span style={{ fontSize: "1rem", fontWeight: 600 }}>
            {dislikeCount}
          </span>
        </Button>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h5 className="mt-4 mb-3">댓글</h5>

        {commentLoading ? (
          <div className="text-center mb-2 text-secondary">
            댓글을 불러오는 중...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center mb-2 text-secondary">
            등록된 댓글이 없습니다.
          </div>
        ) : (
          comments.map((comment) => {
            const isCommentAuthor =
              currentUser &&
              comment.author &&
              String(currentUser.id) === String(comment.author.id);

            return (
              <div
                className="mb-2 p-3 rounded border"
                key={comment.id}
                style={{ background: "#f8f9fa" }}
              >
                {editingCommentId === comment.id ? (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                      variant="outlined"
                    />
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => handleSaveEditComment(comment.id)}
                    >
                      수정 완료
                    </Button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "1rem" }}>{comment.content}</div>
                    <div className="text-muted" style={{ fontSize: ".85rem" }}>
                      {comment.createdAt?.slice(0, 16)}
                    </div>
                    <div className="mt-2">
                      {isCommentAuthor && (
                        <>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="me-2"
                            onClick={() =>
                              handleEditComment(comment.id, comment.content)
                            }
                          >
                            수정
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            삭제
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}

        <form className="mt-3 d-flex" onSubmit={handleCommentSubmit}>
          <TextField
            label="댓글"
            multiline
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!commentText.trim()}
            style={{
              writingMode: "horizontal-tb",
              transform: "none",
              display: "inline-block",
              whiteSpace: "nowrap",
              flexDirection: "row",
              marginLeft: "8px",
            }}
          >
            등록
          </Button>
        </form>
      </div>
    </div>
  );
}

export default BoardDetail;