# 1. Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 나머지 소스 복사
COPY . .

# ====== Vite 환경 변수 (빌드 시점) ======
ARG VITE_API_URL=https://uhyu-api.pillow12360.world
ARG VITE_KAKAO_JS_KEY=4985203a6ae35f0c5db7d25206ec092b
ARG VITE_KAKAO_JAVASCRIPT_KEY=4985203a6ae35f0c5db7d25206ec092b
ARG VITE_KAKAO_REST_API_KEY=53a3872100096cdf985756a17ffb1634
ARG VITE_KAKAO_LOGIN_URL=https://uhyu-api.pillow12360.world/oauth2/authorization/kakao?role=ROLE_USER
ARG VITE_USE_MSW=false

# Vite는 process.env.VITE_* 를 읽기 때문에 빌드할 때 ENV로 넣어두면 됨
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_KAKAO_JS_KEY=$VITE_KAKAO_JS_KEY
ENV VITE_KAKAO_JAVASCRIPT_KEY=$VITE_KAKAO_JAVASCRIPT_KEY
ENV VITE_KAKAO_REST_API_KEY=$VITE_KAKAO_REST_API_KEY
ENV VITE_KAKAO_LOGIN_URL=$VITE_KAKAO_LOGIN_URL
ENV VITE_USE_MSW=$VITE_USE_MSW

# 빌드 실행
RUN yarn build

# 2. Serve Stage (Nginx)
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물을 Nginx 서빙 디렉토리로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 80 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
