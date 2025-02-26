import { computed, onMounted, reactive, ref } from 'vue'
import useHttp from "@/composables/useHttp";
import PresentationService from "@/modules/Product/services/PresentationService";
import type { Ref } from "vue";
import type { Presentation } from "../../types/Presentation";

export default (productId: string) => {
  const saleTypeOptions = [
    { label: 'Mayor', value: 0 },
    { label: 'Detal', value: 1 }  
  ]
  const statusOptions = [
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 0 }
  ]
  
  const presentation: Presentation = reactive({
    id: '',
    bar_cod: "N/A",
    packing_deployed: "",
    packing_json: "",
    status: 1
  })
  
  const presentations: Ref<Presentation[]>  = ref([])
  const panelOpened = ref(false)
  const closeButtonOpened = computed(()=> panelOpened.value ? "Cerrar" : "Abrir")
  const closeClassOpened = computed(()=> panelOpened.value ? "btn-default" : "btn-primary")

  const {  
    errors,
    pending,

    getError
  } = useHttp()

  onMounted(() => getPresentations())
  
  const getPresentations = async () => {
    console.log("aqui")
    pending.value = true
    PresentationService.getPresentations(productId)
      .then(res => presentations.value = res.data)
      .catch(err => errors.value = getError(err))
      .finally(() => pending.value = false) 
  }

  const insertPresentation = async (payload: Presentation) => {
    pending.value = true
    payload.product_id = productId
    return PresentationService.insertPresentation(payload)
      .then((response) => {
        panelOpened.value = false
        getPresentations()    
        alert( response.data.message )
              
      })
      .catch((err) => {                
        console.log( err.response.data )
        errors.value = getError(err)
      })
      .finally(() => {
        pending.value = false
      })
  }

  const updatePresentation = async (payload: Presentation, presentationId: string) => {
    pending.value = true
    payload.product_id = productId
    payload._method = 'PUT'        
    return PresentationService.updatePresentation(payload, presentationId)
      .then((response) => {        
        panelOpened.value = false
        getPresentations()    
        alert( response.data.message )     
      })
      .catch((err) => {                
        console.log( err.response.data )
        errors.value = getError(err)
      })
      .finally(() => {
        pending.value = false
      })
  }
  
  const submit = (payload: Presentation) => {    
    !presentation.id ? insertPresentation (payload)  : updatePresentation(payload, presentation.id)
  }
  
  const remove = async (presentationId: string) => {
    if (presentationId === undefined)
      return
    else if (confirm(`¿Estás seguro que desea eliminar el registro ${presentationId}?`)) {  
      pending.value = true    
      return PresentationService.deletePresentation(presentationId)
        .then((response) => {        
          getPresentations()
        })
        .catch((err) => {                
          console.log( err.response.data )
          errors.value = getError(err)
        })
        .finally(() => {
          pending.value = false
        })
    }
  }

  const edit = (p: Presentation) => {
    presentation.id = p.id
    presentation.bar_cod = p.bar_cod
    presentation.packing_deployed = p.packing_deployed
    presentation.packing_json = p.packing
    presentation.status = p.status
    panelOpened.value = true
  }

  const togglePanel = () => {
    presentation.id = "";
    presentation.bar_cod = "N/A";
    presentation.packing_deployed = "";
    presentation.packing_json = "";
    presentation.status = 1;
    panelOpened.value=!panelOpened.value;
  }

  return {
    panelOpened,
    closeButtonOpened,
    closeClassOpened,
    presentations,
    presentation,
    saleTypeOptions,
    statusOptions,

    edit,
    getPresentations,
    remove, 
    submit,
    togglePanel
  }
}
