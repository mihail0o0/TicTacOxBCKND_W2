const express = require('express');

function createRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    return result;
}

function decidePlayerTurn() {
  return Math.round(Math.random());
}

function decidePlayableMove(data) {
  if(data.JOINORHOST == 'true' && data.turn == '1'){
      return true;
  }
  else if(data.JOINORHOST == 'false' && data.turn == '0'){
      return true;
  }
  
  return false;
}

module.exports = { createRandomString, decidePlayerTurn, decidePlayableMove }