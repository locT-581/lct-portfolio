# Project Detail — Outline

## 1. Project Hero / Quick Overview

Mục tiêu: giúp người xem hiểu project trong vài giây đầu.

### Nội dung
- Project Name
- One-line Description
- Cover / Product Screenshot
- Role
- Timeline
- Industry / Domain
- Platform
- Team Size
- Tech Stack
- Live Demo
- Source Code / GitHub nếu public

### Ví dụ cấu trúc

**Project Name**  
HR Management Platform

**Description**  
A centralized workforce management platform for employee data, leave, attendance, and approval workflows.

**Role**  
Full-stack Developer

**Timeline**  
6 months

**Team**  
8 people

**Platform**  
Web Application

**Stack**  
Next.js · NestJS · PostgreSQL · Redis

---

# 2. Overview / Project Context

Mục tiêu: giải thích project là gì và tồn tại trong bối cảnh nào.

### Trả lời các câu hỏi
- Đây là sản phẩm gì?
- Ai sử dụng?
- Sử dụng trong hoàn cảnh nào?
- Project thuộc domain nào?
- Đây là sản phẩm nội bộ, SaaS, client project hay personal project?

### Nội dung nên ngắn
Khoảng 1–3 đoạn.

---

# 3. Problem

Đây là phần giải thích **tại sao project cần tồn tại**.

Nên chia thành hai góc nhìn.

## 3.1 Business Problem

### Trả lời
- Client / doanh nghiệp đang gặp vấn đề gì?
- Vấn đề đó gây ảnh hưởng gì?
- Tại sao họ cần đầu tư xây sản phẩm này?

### Có thể liên quan đến
- Chi phí
- Thời gian
- Doanh thu
- Conversion
- Quy trình thủ công
- Dữ liệu phân tán
- Khả năng quản lý
- Khả năng mở rộng
- Marketing
- Customer acquisition

---

## 3.2 User Problem

### Trả lời
- Người dùng cuối đang gặp khó khăn gì?
- Họ đang thực hiện công việc bằng cách nào?
- Điều gì mất thời gian hoặc gây bất tiện?
- Họ thiếu thông tin hoặc capability gì?

Nếu có nhiều user role, có thể chia theo từng nhóm.

Ví dụ:

### Employee
...

### Manager
...

### HR
...

---

# 4. Project Goal

Mục tiêu: mô tả **project cần đạt được điều gì**, không mô tả cách implementation.

### Trả lời
- Success của project được định nghĩa thế nào?
- Sản phẩm cần cải thiện điều gì?
- Những outcome nào quan trọng?

### Ví dụ
- Centralize employee information
- Reduce manual HR processes
- Improve lead conversion
- Improve customer access to project information
- Reduce API response time
- Standardize approval workflows

---

# 5. Team & Scope

Mục tiêu: giúp người xem hiểu môi trường làm việc và quy mô project.

## 5.1 Project Team / Squad

Liệt kê những người trực tiếp tham gia delivery.

Ví dụ:

- 1 Product Owner
- 1 Business Analyst
- 1 UI/UX Designer
- 2 Frontend Developers
- 2 Backend Developers
- 1 QA Engineer

### Có thể thêm
- Total team size
- Squad size
- Engineering team size

---

## 5.2 Project Scope

Mô tả phạm vi của project.

### Có thể gồm
- Web Application
- Mobile Application
- Admin Portal
- Backend APIs
- Internal Dashboard
- Third-party integrations
- Infrastructure
- Authentication
- Payment
- Reporting

---

# 6. My Role

Một trong những section quan trọng nhất.

Mục tiêu: làm rõ **bạn thực sự làm gì trong project**.

### Nội dung

**Role**  
Frontend Developer / Backend Developer / Full-stack Developer / Tech Lead...

### Responsibilities
- Những module bạn phụ trách
- Những feature bạn implement
- Architecture bạn tham gia thiết kế
- Database
- API
- Performance
- Testing
- Deployment
- Code review
- Technical decision

### Ownership

Nếu phù hợp, ghi rõ:

**Owned**
- Authentication
- Employee module
- Leave workflow
- Dashboard API
- Frontend architecture

**Contributed**
- Infrastructure
- CI/CD
- Product discussions

---

# 7. Solution

Mục tiêu: giải thích sản phẩm giải quyết problem như thế nào.

Không đi sâu kỹ thuật ở đây.

### Trả lời
- Sản phẩm được xây như thế nào ở mức product?
- User flow chính là gì?
- Các capability chính là gì?

### Format gợi ý

Problem  
↓  
Solution  
↓  
Expected Outcome

---

# 8. Key Features

Mục tiêu: giới thiệu những capability quan trọng nhất của sản phẩm.

Không nên liệt kê toàn bộ feature.

Chọn khoảng **3–6 feature có giá trị nhất**.

## Feature 01
- Feature name
- Screenshot
- Feature làm gì?
- User nào sử dụng?
- Nó giải quyết problem nào?

## Feature 02
...

## Feature 03
...

---

# 9. User Flow / Core Workflow

Optional nhưng rất hữu ích với các project có workflow phức tạp.

### Ví dụ

Employee submits leave request  
↓  
System validates balance  
↓  
Manager receives request  
↓  
Manager approves  
↓  
Leave balance updates  
↓  
Employee receives notification

Có thể dùng:
- Flow diagram
- Sequence
- Screenshots
- Step-by-step explanation

---

# 10. Technical Architecture

Phần dành nhiều hơn cho recruiter, engineering manager và technical client.

### Nội dung
- High-level architecture diagram
- Frontend
- Backend
- Database
- Cache
- Storage
- Queue / background jobs
- External services
- Infrastructure

### Ví dụ

Client  
↓  
Next.js  
↓  
API  
↓  
NestJS  
↓  
PostgreSQL / Redis / Queue

---

# 11. Architecture Explanation

Không chỉ show diagram.

Giải thích ngắn:

### Frontend
- Architecture
- State management
- Component structure
- Rendering strategy

### Backend
- Modular architecture
- Domain separation
- API strategy

### Database
- Data model
- Relationship
- Indexing

### Infrastructure
- Hosting
- Docker
- CI/CD
- Monitoring

Chỉ nói những phần có ý nghĩa với project.

---

# 12. Technical Challenges

Đây là một trong những section quan trọng nhất của portfolio developer.

Mỗi challenge nên theo cùng một cấu trúc.

## Challenge 01 — [Tên vấn đề]

### Problem
Điều gì xảy ra?

### Why It Was Difficult
Tại sao vấn đề này khó?

### Investigation
Bạn đã tìm nguyên nhân thế nào?

### Decision / Approach
Bạn quyết định giải quyết bằng cách nào?

### Implementation
Bạn implement như thế nào?

### Result
Kết quả sau thay đổi.

### Ví dụ metric

**Before**  
2.4s

**After**  
620ms

---

## Challenge 02

Lặp lại structure trên.

---

## Challenge 03

Lặp lại nếu thực sự có challenge đáng kể.

Khoảng **2–4 challenges/project** thường là đủ.

---

# 13. Engineering Decisions

Mục tiêu: chứng minh khả năng đưa ra technical decision.

Mỗi decision nên trả lời:

## Decision
Bạn chọn gì?

## Context
Tình huống lúc đó thế nào?

## Alternatives
Có những lựa chọn nào?

## Why This Approach
Tại sao bạn chọn phương án này?

## Trade-offs
Bạn phải đánh đổi điều gì?

## Result
Quyết định đó ảnh hưởng project thế nào?

### Ví dụ
- PostgreSQL vs MongoDB
- REST vs GraphQL
- SSR vs CSR
- Monolith vs Microservices
- Redis caching strategy
- Role-based vs permission-based authorization
- Server-side vs client-side pagination

---

# 14. Performance & Optimization

Nếu project có phần này.

### Có thể trình bày

## Frontend
- LCP
- CLS
- Bundle size
- Lighthouse
- Rendering
- Image optimization

## Backend
- API latency
- Throughput
- Database query time
- Cache hit rate

## Database
- Indexing
- Query optimization
- N+1 queries
- Pagination

### Format tốt

Before → After

Ví dụ:

API Latency  
850ms → 280ms

---

# 15. Security

Quan trọng với SaaS, fintech, HRM, admin system, ecommerce...

### Có thể đề cập
- Authentication
- Authorization
- RBAC
- Permission model
- Resource-level access
- Input validation
- Rate limiting
- Password hashing
- Sensitive data
- Audit log
- Secret management

Chỉ liệt kê những gì thực sự đã implement.

---

# 16. Testing & Quality

### Có thể gồm

## Unit Testing
Các business logic quan trọng.

## Integration Testing
API + database + services.

## E2E Testing
Critical user journeys.

## Other Quality Practices
- Code review
- Type safety
- Linting
- CI
- Automated tests
- Error monitoring

---

# 17. Impact / Results

Một trong những section quan trọng nhất.

Nên chia thành hai nhóm.

## 17.1 Business Impact

Ví dụ:
- Conversion increase
- More leads
- Reduced operational cost
- Reduced manual work
- Faster approval
- More users
- Increased revenue
- Reduced support requests

---

## 17.2 Engineering Impact

Ví dụ:
- API latency reduced
- Page load improved
- Lighthouse score improved
- Infrastructure cost reduced
- Test coverage increased
- Error rate reduced

### Ưu tiên metric

**Before → After**

hoặc

**+X% / -X%**

Nếu không có số liệu thực tế, không nên tự tạo metric.

Có thể mô tả qualitative result thay thế.

---

# 18. Product Gallery

Show sản phẩm sau khi người xem đã hiểu câu chuyện.

### Có thể gồm
- Homepage
- Dashboard
- Main workflow
- Mobile
- Admin
- Settings
- Dark mode
- Responsive screens

Mỗi screenshot nên có caption giải thích nó đang thể hiện gì.

---

# 19. What I Learned

Mục tiêu: thể hiện khả năng reflection.

### Trả lời
- Bạn học được gì?
- Technical assumption nào ban đầu không đúng?
- Điều gì khiến bạn thay đổi cách suy nghĩ?
- Skill nào được cải thiện?

Tránh kiểu:

> I learned a lot about React.

Ưu tiên:

> I learned that authorization complexity grows primarily from resource-level rules rather than the number of roles.

---

# 20. What I Would Do Differently

Section rất mạnh cho developer mid/senior.

### Trả lời
- Nếu làm lại, bạn sẽ thay đổi gì?
- Kiến trúc nào nên được thiết kế sớm hơn?
- Technical debt nào có thể tránh?
- Decision nào hiện tại bạn sẽ lựa chọn khác?

### Format

**Current approach**  
...

**Problem discovered later**  
...

**If rebuilding today**  
...

---

# 21. Final Outcome / Closing

Một đoạn ngắn tổng kết project.

### Có thể cover

**Product**
Project đã giải quyết business/user problem thế nào.

**Engineering**
Project chứng minh những technical capability nào.

Ví dụ:

The project transformed fragmented HR processes into a centralized platform while requiring solutions around authorization, domain modeling, transactional consistency, caching, and workflow design.

---

# 22. Project Navigation

Cuối page:

**← Previous Project**

**Next Project →**

Có thể thêm:

- Live Demo
- GitHub
- Contact / Work With Me

---

# Cấu trúc tổng thể

PROJECT HERO  
↓  
OVERVIEW  
↓  
PROBLEM  
├── Business Problem  
└── User Problem  
↓  
PROJECT GOAL  
↓  
TEAM & SCOPE  
↓  
MY ROLE  
↓  
SOLUTION  
↓  
KEY FEATURES  
↓  
USER FLOW  
↓  
TECHNICAL ARCHITECTURE  
↓  
TECHNICAL CHALLENGES  
↓  
ENGINEERING DECISIONS  
↓  
PERFORMANCE  
↓  
SECURITY  
↓  
TESTING  
↓  
IMPACT  
├── Business Impact  
└── Engineering Impact  
↓  
PRODUCT GALLERY  
↓  
WHAT I LEARNED  
↓  
WHAT I WOULD DO DIFFERENTLY  
↓  
FINAL OUTCOME  
↓  
NEXT PROJECT

---

# Phiên bản tôi khuyên dùng thực tế

Không phải project nào cũng cần tất cả 22 section.

Một **Project Detail mạnh nhưng không quá dài** có thể chỉ cần:

1. Project Hero  
2. Overview  
3. Problem  
4. Goal  
5. Team & Scope  
6. My Role  
7. Solution  
8. Key Features  
9. Technical Architecture  
10. Technical Challenges  
11. Engineering Decisions  
12. Impact  
13. Product Gallery  
14. What I Learned / What I'd Improve  
15. Next Project

Đây là cấu trúc tôi khuyên dùng làm **template mặc định cho portfolio developer**.

Với project đơn giản như landing page, có thể giảm Technical Architecture, Security, Testing.

Với project SaaS, enterprise, backend-heavy hoặc system design-heavy, nên tăng trọng số cho Architecture, Technical Challenges, Decisions, Performance và Trade-offs.

---

# Review Notes & Practical Guidelines (Party Mode Insights)

Được đúc kết từ phiên phản biện chuyên môn giữa System Architect, Senior Dev, UX Designer, PM và Tech Writer:

### 1. Phân tầng độc giả & Chống Recruiter Fatigue (UX Strategy)
* **Thực tế độc giả:** Recruiter và Engineering Manager chỉ dành trung bình **45–90 giây** khi lướt qua một case study trước khi quyết định phỏng vấn.
* **Quy tắc 2 tầng (Two-Tier Layering):**
  * **Tầng 1 — Quick Scan (30s):** Hero Bento Card (Title, Role, Stack, Live Demo), Key Features (kèm Visual Screenshot), Impact Metrics nổi bật.
  * **Tầng 2 — Deep Dive (3–5 phút cho Tech Lead):** Technical Architecture, Deep-dive Challenges (Problem $\to$ Root Cause $\to$ Fix), Engineering Decisions & Trade-offs.
* **Visual Hierarchy:** Đưa **Product Visual / Gallery lên sớm** (ngay sau Hero hoặc cạnh Overview/Features) thay vì để tuốt cuối trang (Mục 18) để giữ chân độc giả bằng ấn tượng trực quan.

### 2. Tiêu chuẩn viết Technical Challenges (Mục 12) & Decisions (Mục 13)
* **Công thức 6 bước vàng cho Senior Dev:**
  1. `Problem`: Sự cố / nút thắt gì xảy ra?
  2. `Why It Was Difficult`: Tại sao không thể fix bằng cách thông thường?
  3. `Investigation`: Đo lường, profiling, root cause analysis như thế nào?
  4. `Decision / Approach`: Lựa chọn giải pháp nào giữa các options?
  5. `Implementation`: Triển khai kỹ thuật cụ thể (code snippet / configuration).
  6. `Result`: Kết quả định lượng (Before $\to$ After) hoặc định tính rõ ràng.
* **Quy tắc Metric trung thực:** Tuyệt đối không bịa số liệu "ảo". Nếu không có công cụ đo đạc chính xác, hãy mô tả định tính (Qualitative) về sự ổn định, khả năng maintain, hoặc developer experience.

### 3. Gộp các mục trùng lặp để bài viết cô đọng
* **Mục 10 + Mục 11:** Gộp Diagram kiến trúc và phần giải thích chi tiết thành 1 khối duy nhất `Technical Architecture & Design`.
* **Mục 19 + Mục 20:** Gộp `What I Learned` và `What I Would Do Differently` thành `Retrospective & Key Takeaways` để tránh lặp ý.

### 4. Chiến lược Phân chia Dữ liệu: Fixed UI Fields vs CMS RichText
* **Fixed UI Fields (Metadata có cấu trúc):** Title, Slug, Working Period, Role, Client, Live Demo / GitHub URL, Tech Stack Badges, Thumbnail, Project Type, Featured Status.
* **CMS RichText / PortableText (Nội dung kể chuyện linh hoạt):** Problem Context, User Flows, Technical Deep Dives, Code Blocks, Architecture Breakdown, Retrospectives.