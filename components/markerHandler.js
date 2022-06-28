var modelList = []

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var models = await this.getModelGeometry()
    
    this.el.addEventListener("markerFound", () => {
      var modelName = this.el.getAttribute("model_name")
      var barcodeValue = this.el.getAttribute("barcode_value")
      modelList.push({ model_name: modelName, barcode_value: barcodeValue })
      models[barcode_value]["model"].map(() => {
        var model = document.querySelector(`#${modelName}-${barcodeValue}`)
        model.setAttribute("visible", true)
      })
    })

    this.el.addEventListener("markerLost", () => {
      var modelName = this.el.getAttribute("model_name")
      var index = modelList.findIndex(x => x.barcode_value === modelName)
      if (index > -1) {
        modelList.splice(index, 1)
      }
    })
  },

  tick: function () {
    if (modelList.length > 1) {
      var isBaseModelPresent = this.isModelPresentInArray(modelList, "base")
      var messageText = document.querySelector("#message-text")

      if (!isBaseModelPresent) {
        messageText.setAttribute("visible", true)
      } else {
        if (models === null) {
          models = await this.getModels()
        }

        messageText.setAttribute("visible", false)
        this.placeTheModel("road", models)
        this.placeTheModel("car", models)
        this.placeTheModel("building1", models)
        this.placeTheModel("building2", models)
        this.placeTheModel("building3", models)
        this.placeTheModel("tree", models)
        this.placeTheModel("sun", models)
      }
    }
  },
  
  isModelPresentInArray: function (array, value) {
    for (var i of array) {
      if (i.model_name === value) {
        return true
      }
    }
    return false
  },

  placeTheModel: function (model_name, models) {
    var isListContainModel = this.isModelPresentInArray(modelList, model_name)
    if (isListContainModel) {
      var distance = null
      var marker1 = document.querySelector("#marker-base")
      var marker2 = document.querySelector(`#marker-${model_name}`)
      
      distance = this.getDistance(marker1, marker2)
      if (distance < 1.25) {
        var modelElement = document.querySelector(`#${model_name}`)
        modelElement.setAttribute("visible", false)

        var isModelPlaced = document.querySelector(`#model-${model_name}`)
        if (isModelPlaced === null) {
          var element = document.createElement("a-entity")
          var modelGeometry = this.getModelGeometry(models, model_name)
          element.setAttribute("id", `#model-${model_name}`)
          element.setAttribute("gltf-model", `url(${modelGeometry.model_url})`)
          element.setAttribute("position", modelGeometry.position)
          element.setAttribute("rotation", modelGeometry.rotation)
          element.setAttribute("scale", modelGeometry.scale)

          marker1.appendChild(element)
        }
      }
    }
  },

  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position)
  },
  getModelGeometry: function (models, modelName) {
    var barcodes = Object.keys(models)
    for (var bacode of barcodes) {
      if (models[barcode].model_name === modelName) {
        return {
          position: models[barcode]["placement_position"],
          rotation: models[barcode]["placement_rotation"],
          scale: models[barcode]["placement_scale"],
          model_url: models[barcode]["model_url"],
        }
      }
    }
  }
})