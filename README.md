# 🐝 Waggle Talks

> 국비 프로그래밍 교육과정 - 1주일 미니 프로젝트  
> Spring Boot 백엔드 + React 프론트엔드 기반 SNS형 게시판 애플리케이션

## 🎯 프로젝트 개요

**Waggle Talks**는 Spring Boot와 React를 활용하여 개발한 풀스택 SNS형 게시판 애플리케이션입니다.  
사용자가 게시물을 작성, 조회, 수정, 삭제할 수 있으며, 댓글 작성, 좋아요/싫어요 기능을 제공합니다.  
짧은 기간 내에 복잡한 관계 데이터(Post-Comment-Like)를 효율적으로 처리하는 방법을 실습하도록 설계되었습니다.

---

## 📁 프로젝트 구조

```
BoardMiniProject/
├── metadata/              # 프로젝트 메타데이터 및 공통 설정
├── board_spring/          # Spring Boot 백엔드 서버
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/board/
│   │   │   │       ├── controller/
│   │   │   │       │   ├── UserController.java
│   │   │   │       │   ├── PostController.java
│   │   │   │       │   ├── CommentController.java
│   │   │   │       │   └── LikeController.java
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── entity/
│   │   │   │       │   ├── User.java
│   │   │   │       │   ├── Post.java
│   │   │   │       │   ├── Comment.java
│   │   │   │       │   └── Like.java
│   │   │   │       └── BoardApplication.java
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   └── build.gradle
└── board_react/           # React 프론트엔드 애플리케이션
    ├── src/
    │   ├── components/
    │   │   ├── PostList.jsx
    │   │   ├── PostDetail.jsx
    │   │   ├── PostForm.jsx
    │   │   ├── CommentSection.jsx
    │   │   └── LikeButton.jsx
    │   ├── pages/
    │   ├── App.jsx
    │   └── index.js
    └── package.json
```

---

## 🛠️ 기술 스택

### Backend
| 항목 | 버전 | 설명 |
|------|------|------|
| **Framework** | Spring Boot 3.5.7 | RESTful API 서버 |
| **Language** | JDK 21 | Java 기반 개발 |
| **Build Tool** | Gradle | 의존성 관리 및 빌드 |
| **ORM** | JPA/Hibernate | 데이터베이스 매핑 |
| **Database** | MySQL 8.0.43 | 관계형 데이터베이스 |

### Frontend
| 항목 | 버전 | 설명 |
|------|------|------|
| **Framework** | React | 컴포넌트 기반 UI |
| **Styling** | Bootstrap 4.6 | 반응형 디자인 |
| **HTTP Client** | Fetch API / Axios | 서버 통신 |
| **Version** | 0.1.0 | 현재 개발 버전 |

### 개발 환경
- **IDE**: IntelliJ IDEA / STS (Spring Tool Suite)
- **Version Control**: Git & GitHub

---

## ✨ 주요 기능

### 1. 사용자 관리
- ✅ 회원가입 (User 등록)
- ✅ 로그인 / 인증
- ✅ 사용자 정보 조회

### 2. 게시물 관리
- ✅ 게시물 목록 조회 (페이지네이션 포함)
- ✅ 게시물 상세 조회
- ✅ 게시물 작성 (Create)
- ✅ 게시물 수정 (Update)
- ✅ 게시물 삭제 (Delete)
- ✅ 게시물 검색

### 3. 댓글 기능
- ✅ 게시물별 댓글 조회
- ✅ 댓글 작성
- ✅ 댓글 수정
- ✅ 댓글 삭제
- ✅ 댓글의 좋아요/싫어요

### 4. 상호작용
- ✅ 게시물 좋아요/싫어요
- ✅ 댓글 좋아요/싫어요
- ✅ 실시간 카운트 업데이트

### 5. UI/UX
- ✅ 반응형 웹 디자인 (Bootstrap 기반)
- ✅ 직관적인 네비게이션
- ✅ 동적 콘텐츠 로딩

---

## 📊 데이터베이스 스키마

### Entity Relationship Diagram (ERD)

```
User (1) ─── (N) Post
 │              │
 │              └─── (N) Comment
 │                       │
 │                       └─── (N) Like
 │
 └─── (N) Like
```

### 테이블 정보

#### User 테이블
| Column | Type | Constraint |
|--------|------|-----------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(50) | NOT NULL, UNIQUE |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL |
| enabled | BIT(1) | DEFAULT 1 |

#### Post 테이블
| Column | Type | Constraint |
|--------|------|-----------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| title | VARCHAR(255) | NOT NULL |
| content | VARCHAR(255) | NOT NULL |
| userId | BIGINT | FOREIGN KEY (User.id) |
| likeCount | INT | DEFAULT 0 |
| dislikeCount | INT | DEFAULT 0 |
| createdAt | DATETIME(6) | DEFAULT CURRENT_TIMESTAMP |
| updatedAt | DATETIME(6) | DEFAULT CURRENT_TIMESTAMP |

#### Comment 테이블
| Column | Type | Constraint |
|--------|------|-----------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| content | VARCHAR(255) | NOT NULL |
| postId | BIGINT | FOREIGN KEY (Post.id) |
| userId | BIGINT | FOREIGN KEY (User.id) |
| likeCount | INT | DEFAULT 0 |
| dislikeCount | INT | DEFAULT 0 |
| createdAt | DATETIME(6) | DEFAULT CURRENT_TIMESTAMP |
| updatedAt | DATETIME(6) | DEFAULT CURRENT_TIMESTAMP |

#### Like 테이블
| Column | Type | Constraint |
|--------|------|-----------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| postId | BIGINT | FOREIGN KEY (Post.id) |
| userId | BIGINT | FOREIGN KEY (User.id) |
| liked | BIT(1) | (1=좋아요, 0=싫어요) |

---

## 🏗️ 아키텍처

### Backend 계층 구조

```
Controller Layer (PostController, CommentController, LikeController, UserController)
        ↓
Service Layer (PostService, CommentService, LikeService, UserService)
        ↓
Repository Layer (PostRepository, CommentRepository, LikeRepository, UserRepository)
        ↓
Database Layer (MySQL)
```

### Frontend 구조

```
React Components
├── Web Component (Main UI)
├── PostList (게시물 목록)
├── PostDetail (게시물 상세)
├── CommentSection (댓글 영역)
├── LikeButton (좋아요 버튼)
└── Client (API 통신)
```

## 🎨 주요 페이지

### 1. 게시물 목록 페이지
- 전체 게시물 목록 표시
- 페이지네이션 (10개씩 표시)
- 검색 기능
- 게시물 제목, 작성자, 작성일, 좋아요/싫어요 수 표시

### 2. 게시물 상세 페이지
- 게시물 제목, 내용, 작성자, 작성일
- 좋아요/싫어요 버튼
- 댓글 목록 및 댓글 작성
- 댓글의 좋아요/싫어요 기능

### 3. 게시물 작성 페이지
- 제목 입력 필드
- 내용 입력 필드
- 등록 버튼

### 4. 사용자 정보 페이지
- 사용자명, 이메일
- 비밀번호 변경

---

## 💡 주요 학습 포인트

### Backend
- **Spring Boot 3.x**: 최신 버전의 스프링 부트 활용
- **JPA/Hibernate**: 복잡한 엔티티 관계 매핑 (One-to-Many, Many-to-One)
- **REST API**: 효율적인 RESTful 설계
- **트랜잭션 관리**: 동시성 제어 및 데이터 일관성
- **Repository 패턴**: 데이터 접근 계층 추상화

### Frontend
- **React Hooks**: useState, useEffect를 활용한 상태 관리
- **컴포넌트 재사용성**: 댓글, 좋아요 버튼 등 재사용 가능한 컴포넌트 설계
- **API 통신**: Fetch API/Axios를 이용한 백엔드 통신
- **동적 데이터 렌더링**: 페이지네이션, 실시간 업데이트

### Database
- **정규화**: 데이터 중복 제거 및 무결성 보장
- **인덱싱**: 쿼리 성능 최적화
- **관계 설정**: Foreign Key를 통한 테이블 간 관계 정의

---

## 🔄 개발 흐름

1. **요구사항 분석** (1일)
   - 게시판의 필요 기능 정의
   - 사용자 스토리 작성

2. **데이터베이스 설계** (1-2일)
   - ERD 작성
   - 테이블 정규화
   - 인덱스 설계

3. **Backend 개발** (2-3일)
   - Entity 정의
   - Repository 구현
   - Service 로직 개발
   - Controller 구현

4. **Frontend 개발** (2-3일)
   - React 컴포넌트 설계
   - API 연동
   - UI/UX 구현

5. **통합 테스트 및 배포** (1일)
   - Backend-Frontend 통합 테스트
   - 버그 수정
   - 최종 배포

---

## 📝 개선 사항

향후 추가 예정 기능:

- [ ] 사용자 인증 (JWT 토큰)
- [ ] 게시물 카테고리 분류
- [ ] 실시간 알림 (WebSocket)
- [ ] 이미지 업로드
- [ ] 해시태그 기능
- [ ] 사용자 팔로우 시스템
- [ ] 댓글 대댓글 지원
- [ ] 게시물 공유 기능

---
---

**마지막 업데이트**: 2026년 1월 25일  
**버전**: 0.1.0 (React) / 3.5.7 (Spring Boot)
