import { Http as h } from "@/utils/Http";
import { commonInit } from "@/utils/Http/init";

const Http = new h( commonInit );

export const getContainers = () => {  
  return Http.get(`/api/measure-unit/containers`);
}

export const getMeasureUnitTypes = () => {  
  return Http.get(`/api/measure-unit/type`);
}

export const getMeasureUnits = (measureUnitTypeId: string) => { 
  return Http.get(`/api/measure-unit/${measureUnitTypeId}`);
}

export default {
  getContainers,
  getMeasureUnitTypes,
  getMeasureUnits
}



