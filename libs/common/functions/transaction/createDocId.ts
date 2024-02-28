export function createDocId(strModule) {
    return  `SP/${strModule["strModule"]}/${new Date().getTime()}`
  }