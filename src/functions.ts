function getScriptProperties(key: string): string {
  const prop = PropertiesService.getScriptProperties().getProperty(key);
  if (prop === null) {
    throw Error(`${key} not found!`);
  }
  return prop;
}
