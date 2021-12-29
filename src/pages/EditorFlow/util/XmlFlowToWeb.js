import { Json2XML, XML2Json } from './XmlToJs';
// import xml2js from 'xml2js';

export const xmlFlow2Web = (content, propsAPI) => {
  let myJson = XML2Json(content);
  const curFlowData = propsAPI.save();

  console.warn('检测是否有', myJson, curFlowData, propsAPI);
};
