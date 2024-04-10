export async function sleep(sec) { 
  return new Promise(resolve => setTimeout(resolve, sec)); 
}

export const getCostumeElements = async (costumeElem) => {
  /** @type {{[key: string]: HTMLElement}} */ const costumes = {};
  for (const elem of costumeElem.children) {
    costumes[elem.id] = elem;
  }
  return costumes;
}