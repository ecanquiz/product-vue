import { computed, reactive, ref, watch } from 'vue'
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import type { Presentation } from "../../types/Presentation";
import type { Packing } from "../../types/Packing";

export default (presentation: Presentation) => {  
  const form = reactive<Presentation>({
    id: presentation.id,
    bar_cod: presentation.bar_cod ? presentation.bar_cod : 'N/A',
    packing_deployed: presentation.packing_deployed,
    packing_json: presentation.packing_json,
    status: presentation.status ? presentation.status : 1
  })

  const isOpenModal = ref(false)

  const acceptModal = (payload: Packing) => {
    form.packing_deployed = payload.packing_description
    form.packing_json = payload.packing_json
  }

  const rules = computed(() => {
    return {
      bar_cod: { required: helpers.withMessage("Campo requerido", required) },
      packing_deployed: { required: helpers.withMessage("Campo requerido", required) },
      packing_json: { required: helpers.withMessage("Campo requerido", required) },
      status: { required: helpers.withMessage("Campo requerido", required) }
    };
  });

  const v$ = useVuelidate(rules, form as unknown as any );
  
  watch(presentation, (newPresentation) => {
    form.bar_cod = newPresentation.bar_cod
    form.packing_deployed = newPresentation.packing_deployed
    form.packing_json = newPresentation.packing_json
    form.status = newPresentation.status
  })

  return {
    form,
    isOpenModal,

    acceptModal,
    v$ 
  }
}
