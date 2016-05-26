#!/bin/bash

function install {
  printf "\e[92m[~] Name your project: \e[0m\n"

  read name

  printf "\e[33m[~] Downloading awesomeness...\e[0m\n"

  git clone https://github.com/mostjs/package-starter $name \
  && cd $name \
  && rm -rf ./.git \
  && git init \
  && npm install \
  && sed -i -- "s/mostPackage/${name}/g" package.json 

  printf "\e[32m[✔] Successfully installed ${name}\e[32m!\n"
}

install 
