import xml2js from 'xml2js';

const Json2XML = (content: object) => {
  let builder = new xml2js.Builder();
  let xml = builder.buildObject(content);
  return xml;
};

const XML2Json = (content: string) => {
  let result;
  let parser = xml2js.parseString;
  parser(content, { explicitArray: false }, function (err: any, obj: any) {
    result = obj;
    if (err) {
      console.warn(err);
    }
  });
  return result;
};

export { Json2XML, XML2Json };
