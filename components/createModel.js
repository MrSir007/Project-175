AFRAME.registerComponent("createModels", {
  init: function () {
    var models = await this.getModels()
    var barcodes = Object.keys(models)
    barcodes.map(barcode => {
      var model = models[barcode]
      this.createModels(model)
    })
  },
  getModels: function () {
    return fetch("./components/models.json")
      .then(response => response)
      .then(data => data)

  },
  createModels: function (models) {
    var barcode_value = models.barcode_value
    var model_url = models.model_url
    var model_name = models.model_name

    var scene = document.querySelector("a-scene")
    
    var marker = document.createElement("a-marker")
    marker.setAttribute("id", `marker-${barcodeValue}`)
    marker.setAttribute("type", "barcode")
    marker.setAttribute("element_name", elementName)
    marker.setAttribute("value", barcodeValue)
    scene.appendChild(marker)

    if (barcode_value === 0) {
      var model = document.createElement("a-entity")
      model.setAttribute("id", { model_name })
      model.setAttribute("geometry", {
        primitive: "box",
        width: models.width,
        height: models.height
      })
      model.setAttribute("position", models.position)
      model.setAttribute("rotation", models.rotation)
      model.setAttribute("material", { color: models.color })
      marker.appendChild(model)
    } else {
      var model = document.createElement("a-entity")
      model.setAttribute("id", { model_name })
      model.setAttribute("gltf-model", `url(${model_url})`)
      model.setAttribute("position", models.position)
      model.setAttribute("rotation", models.rotation)
      model.setAttribute("scale", models.scale)
    }
  }
})