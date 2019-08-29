FROM node:10-jessie AS builder

WORKDIR /usr/src

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn

# Copy the relevant files to the working directory
COPY . .

# Build and export the app
RUN yarn build
# RUN cp -R dist /public


FROM nginx:1.15-alpine
ENV TZ=Asia/Shanghai
ENTRYPOINT ["nginx", "-g", "daemon off;"]
WORKDIR /app
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder usr/src/dist/ /app
