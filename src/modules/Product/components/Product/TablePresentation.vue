<script setup lang="ts">
import { toRaw, ref } from "vue"
import ModalImage from './ModalImage.vue'
import PresentationService from "@/modules/Product/services/PresentationService"
import IconCamera from "@/components/icons/IconCamera.vue"

import type { Presentation } from "../../types/Presentation";

const props = defineProps<{ presentations: Presentation[] }>()

const emits = defineEmits<{
  (e: 'edit', presentationId: object): void
  (e: 'remove', presentationId: string): void
  (e: 'getPresentations' ): void
}>()

const edit =  (presentation: object) => {
  emits("edit", toRaw(presentation))
};

const remove =  (presentationId: string) => {
  emits("remove", presentationId)
};

const imageUpload = (id: string) => {
  presentationId.value=id.toString()
  isOpenModal.value = true
}
const isOpenModal = ref(false)
const presentationId = ref("")

const acceptModal= (f) => {  
  //console.log(f)  
  uploadFile(f)
}

const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file.files.image);

  PresentationService.uploadFilePresentation(formData, presentationId.value)
  .then((response) => {
    alert(response.data.message)
    emits("getPresentations")        
  })
  .catch((error) => console.log(error));
}

const imgPath = (presentation) => `${import.meta.env.VITE_APP_API_URL}/${presentation.photo_path}`

const status = (s) => s ? 'Activo' : 'Inactivo';
</script>

<template>
  <div class="mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
    <table id="id_tab_presentacion" class="w-full text-sm text-left text-gray-500 dark:text-gray-400" width="100%">
      <thead class="text-xs text-gray-700 uppercase dark:text-gray-400">
        <tr>
          <th class="px-6 py-3">Imagen</th>
          <th class="px-6 py-3 bg-gray-50 bg-base-200 text-center">CÓDIGO DE BARRA</th>        
          <th class="px-6 py-3">Empaque</th>
          <th class="px-6 py-3 bg-gray-50 bg-base-200 text-center">Estatus</th>
          <th class="px-6 py-3 text-center">Acción(es)</th>
        </tr>
      </thead>
      <tbody>      
        <tr v-for="presentation in props.presentations" :key="presentation.id">
          <td class="px-6 py-3 w-20 h-20">
            <img
              v-if="presentation.photo_path"
              class="m-auto hover:cursor-pointer"
              :src=imgPath(presentation)
              @click="imageUpload(presentation.id)"
            />
            <IconCamera
              v-else
              class="w-7 h-7 m-auto fill-current hover:cursor-pointer"
              @click="imageUpload(presentation.id)"
            />
          </td>           
          <td class="px-6 py-3 bg-gray-50 bg-base-200 text-center">{{ presentation.bar_cod }}</td>
          <td class="px-6 py-3" :id='presentation.packing'>{{ presentation.packing_deployed }}</td>
          <td class="px-6 py-3  bg-gray-50 bg-base-200 text-center">{{ status(presentation.status) }}</td>          
          <td class="px-6 py-3 flex justify-center">
            <div class="flex items-center space-x-1">
             <AppBtn
                class="btn btn-primary btn-xs"                    
                @click="edit(presentation)"
              >
                Editar
              </AppBtn>
              <AppBtn
                @click="remove(presentation.id)"                    
                class="btn btn-danger btn-xs"                    
              >
                Eliminar
              </AppBtn>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <ModalImage
      v-if="isOpenModal"
      :presentationId="presentationId"
      @closeModal="isOpenModal = false"
      @acceptModal="acceptModal"
    />
  </div>  
</template>
