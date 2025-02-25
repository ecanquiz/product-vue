import { reactive, computed } from "vue"
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

export default (measureUnit) => {  
  const form = reactive({
    packing_description: "",
    packing_json: "",
  })
  
  const rules = computed(() => {
    return {      
      packing_description: {
        required: helpers.withMessage("Campo requerido", required),
      },
      packing_json: {
        required: helpers.withMessage("Campo requerido", required),
      }
    };
  });
  
  const v$ = useVuelidate(rules, form);

  let position = 0, i = 0, packingJson = [], temp = 0;
  const aConect = [ ' DE ', ' CON ', '' ];

  const add = (payload: {packing: string, quantity: number}): void => {
    const isntPackaged = ['N/A', 'GRANEL'].includes(payload.packing);
    if (isntPackaged) {
      payload.packing = '';
      temp = position;
      position = 2;
    }
     
    let concatenate1 = `${payload.packing} ${aConect[position++]} ${payload.quantity} `;
    let concatenate2 = form.packing_description.trim() === "" ? measureUnit.value : form.packing_description;

    form.packing_description = concatenate1 + concatenate2;
    packingJson[i++] = `{"packing":"${payload.packing}","quantity":${payload.quantity}}`;
    form.packing_json = `[${packingJson}]`;

    if (isntPackaged) {
      position=temp;
      temp=0;
    }

    if (position == 2)
      position = 0;  
  }

  const remove = ()=> { //cleanAfter()   
    form.packing_description = "";
    form.packing_json = "";
  }

  const lastPacking = computed(()=> form.packing_description.split(" ")[0]);

  const labelOfquantity = computed(()=> "Cantidad de " + (form.packing_description=="" ? measureUnit.value : lastPacking.value));

  return {
    form,
    labelOfquantity,

    add,
    remove,    
    v$
  }
}
