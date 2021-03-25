FROM node:14

ENV USERNAME=node

ENV SHELL /bin/bash
RUN export DEBIAN_FRONTEND=noninteractive \
&& apt-get update \
&& apt-get upgrade -y \
&& apt-get install -y \
    git \
    nano \
    sudo \
    vim \
&& rm -rf /var/lib/apt/lists/* \
&& echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
&& chmod 0440 /etc/sudoers.d/$USERNAME
