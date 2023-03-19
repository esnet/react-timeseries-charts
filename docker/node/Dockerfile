FROM node:18

RUN apt-get update; \
    apt-get install -y \
    sudo \
    build-essential \
    git \
    curl \
    groff \
    less \
    vim \
    unzip \
    jq


RUN npm install -g \
    gulp \
    mocha \
    eslint 

RUN mkdir /server
VOLUME /server

RUN echo "node:node" | chpasswd \
    && gpasswd -a node sudo

USER node
ENV TERM xterm
ENV HOME /home/node
ENV LANG C.UTF-8
ENV PORT 3000

EXPOSE 3000

WORKDIR /server


CMD ["/bin/bash"]
