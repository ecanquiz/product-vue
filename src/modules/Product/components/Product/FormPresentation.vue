<script setup lang="ts">
import { toRaw } from "vue"
import ModalPacking from './ModalPacking.vue'
import useFormPresentation from "../../composables/Product/useFormPresentation";
import type { RadioOption } from "@/types/RadioOption";
import type { Presentation } from "../../types/Presentation";

const props = defineProps<{
  presentation: Presentation
  saleTypeOptions: RadioOption[]
  statusOptions: RadioOption[]
}>()

const {
  form,
  isOpenModal,

  acceptModal,
  v$
} = useFormPresentation(props.presentation)

const emits = defineEmits<{
  (e: 'submit', form: Presentation): void
}>()

const submit = async () => {
  const result = await v$.value.$validate();
  if (result) {
    emits("submit", toRaw(form));
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="submit">
      <div class="p-5 grid lg:grid-cols-2 gap-4">    
        <div class="block">
          <AppTextarea
            class="cursor-pointer"
            label="Empaque"
            v-model="form.packing_deployed"                
            @focus="isOpenModal = !isOpenModal"                
            readonly
            :error="v$.packing_deployed.$error ? v$.packing_deployed.$errors[0].$message : null"
          />
          <AppInput
            v-model="form.packing_json"          
            type="hidden"          
          />                        
        </div>     
        <div class="block">
          <AppInput
            label="Código de Barra"
            v-model="form.bar_cod"                     
            type="text"
            :error="v$.bar_cod.$error ? v$.bar_cod.$errors[0].$message : null"
          />
        </div>
        <div class="block">             
          <AppRadioGroup
            v-model="form.status"
            name="status"
            :options="props.statusOptions"
            :error="v$.status.$error ? v$.status.$errors[0].$message : null"
          />
        </div>
      </div>
      <div class="block">
        <AppBtn
          type="submit"                 
          data-testid="submit-btn"
          class="btn btn-primary"
          text="Agregar"
        />        
      </div> 
    </form>
    <ModalPacking
      v-if="isOpenModal"      
      @closeModal="isOpenModal = false"
      @acceptModal="acceptModal"
    />
  </div>
</template>
