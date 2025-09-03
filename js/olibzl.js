// F002 set
const materialsF002 = [
    { Key: "Cabin5 : 10", Value: "mat002" },
    { Key: "Cabin5 : 9", Value: "mat002" },
    { Key: "Cabin2 : 14", Value: "mat002" },
    { Key: "Cabin2 : 9", Value: "mat002" },
    { Key: "Cabin3 : 7", Value: "mat002" },
    { Key: "Cabin5 : 0", Value: "mat003" },
    { Key: "Cabin3 : 3", Value: "mat003" },
    { Key: "Cabin2 : 4", Value: "mat003" },
    { Key: "Cabin3 : 5", Value: "mat004" },
    { Key: "Cabin5 : 1", Value: "mat007" },
    { Key: "Cabin1 : 2", Value: "mat007" },
    { Key: "Cabin1 : 1", Value: "mat002" },
    { Key: "Cabin2 : 6", Value: "mat007" },
];

// F003 set
const materialsF003 = [
    { Key: "Cabin5 : 10", Value: "mat003" },
    { Key: "Cabin5 : 9", Value: "mat003" },
    { Key: "Cabin2 : 14", Value: "mat003" },
    { Key: "Cabin2 : 9", Value: "mat003" },
    { Key: "Cabin3 : 7", Value: "mat003" },
    { Key: "Cabin5 : 0", Value: "mat002" },
    { Key: "Cabin3 : 3", Value: "mat002" },
    { Key: "Cabin2 : 4", Value: "mat002" },
    { Key: "Cabin3 : 5", Value: "mat005" },
    { Key: "Cabin5 : 1", Value: "mat006" },
    { Key: "Cabin1 : 2", Value: "mat006" },
    { Key: "Cabin1 : 1", Value: "mat003" },
    { Key: "Cabin2 : 6", Value: "mat006" },
];

const libzl = new LibZL();

const cloudstreamSettings = {
    directConnection: false,
    cloudConnectionParameters: {
        customer: "omnistream",
        renderService: "078fc39dtestser",
    },
    streamingMode: "video",
    parent: "streamContainer",
};

libzl.cloudstream("cloudstreamExample").then(function (api) {
    //Adding to the global namespace
    cloudstream = window.cloudstream = api;

    //Adding event listeners to what we're interested in
    cloudstream.addEventListener("error", function (error) {
        console.log("OmniStream had an error: ", error);
    });
    cloudstream.addEventListener("streamReady", function () {
        console.log("The stream is ready!");

        // Attach click listeners to cameras
        document.querySelectorAll(".camera").forEach((camera) => {
            camera.addEventListener("click", () => {
                const camName = camera.dataset.camera; // e.g. "Poppa"

                const data = {
                    Type: 0,
                    Key: "test",
                    Value: camName,
                };

                console.log("Sending camera data:", data);
                //console.log("Sending camera str data:", JSON.stringify(data));
                cloudstream.sendJsonData(data);

                document.querySelectorAll(".camera").forEach((c) => c.classList.remove("active"));
                camera.classList.add("active");
            });
        });

        document.querySelectorAll(".scene").forEach((scene) => {
            scene.addEventListener("click", () => {
                const parent = scene.closest(".scene-container").parentElement;

                // remove previous active in the same container
                parent.querySelectorAll(".scene").forEach((el) => el.classList.remove("active"));
                scene.classList.add("active");

                // update scene-label text
                const label = parent.previousElementSibling; // the .scene-label
                if (label && label.classList.contains("scene-label")) {
                    label.textContent = scene.dataset.name || "";
                }

                // ===== NEW LOGIC: update Essenza block =====
                const essenzaContainer = document.querySelector(".interior-scenes-container.essenza");
                const essenzaLabel = essenzaContainer?.previousElementSibling;

                if (essenzaContainer) {
                    const essenzaScenes = essenzaContainer.querySelectorAll(".essenza-scene");

                    if (scene.dataset.name === "Dinette") {
                        // Dinette → Essenza F002 / F003

                        essenzaScenes[0].dataset.name = "F002";
                        essenzaScenes[1].dataset.name = "F003";
                        const activeEssenza = essenzaContainer.querySelector(".essenza-scene.active");
                        essenzaLabel.textContent = activeEssenza ? activeEssenza.dataset.name : "F002";
                    } else if (scene.dataset.name === "Cabin") {
                        // Cabin → Essenza F000 / F001

                        essenzaScenes[0].dataset.name = "F000";
                        essenzaScenes[1].dataset.name = "F001";
                        const activeEssenza = essenzaContainer.querySelector(".essenza-scene.active");
                        essenzaLabel.textContent = activeEssenza ? activeEssenza.dataset.name : "F000";
                    }
                }

                // get combined value
                const activeEx = document.querySelector(".exterior-scenes-container .scene.active");
                const activeIn = document.querySelector(".interior-scenes-container .scene.active");

                const exValue = activeEx ? activeEx.dataset.exscene : "";
                const inValue = activeIn ? activeIn.dataset.inscene : "";

                const value = exValue && inValue ? `${exValue}_${inValue}` : exValue || inValue;

                const data = {
                    Type: 1,
                    Key: "",
                    Value: value,
                };

                console.log("Sending scene data:", data);
                cloudstream.sendJsonData(data);
            });
        });

        document.querySelectorAll(".exterior-scenes-container").forEach((container) => {
            const label = container.previousElementSibling;
            const wrappers = container.querySelectorAll(".texture-wrapper");

            wrappers.forEach((wrapper) => {
                wrapper.addEventListener("click", () => {
                    wrappers.forEach((w) => w.classList.remove("active"));

                    wrapper.classList.add("active");
                    //{"Type":2,"Key":"Hull5 : 1","Value":"mat020"}

                    // split meshes if multiple (separated by ;)
                    const meshes = wrapper.dataset.mesh.split(";").map((m) => m.trim());

                    meshes.forEach((mesh) => {
                        const data = {
                            Type: 2,
                            Key: mesh,
                            Value: wrapper.dataset.mat,
                        };

                        console.log("Sending material data:", data);
                        cloudstream.sendJsonData(data);
                    });

                    if (label && label.classList.contains("normal")) {
                        label.textContent = wrapper.dataset.name;
                    }

                    if (wrapper.dataset.cucina === "true") {
                        const anteRadioNo = document.querySelector(".ante-cucina-selector input[value='No']:checked");
                        if (anteRadioNo) {
                            const data = {
                                Type: 2,
                                Key: "Hull2 : 3",
                                Value: wrapper.dataset.mat,
                            };
                            console.log("Sending additional material for Ante Cucina = No:", data);
                            cloudstream.sendJsonData(data);
                        }
                    }
                });
            });
        });

        document.querySelectorAll(".cockpit-selector input[type=radio]").forEach((radio) => {
            radio.addEventListener("change", () => {
                if (radio.checked) {
                    const dataTop = {
                        Type: 2,
                        Key: "Hull1 : 3",
                        Value: "mat021",
                    };
                    let dataBottom = {
                        Type: 2,
                        Key: "Hull1 : 0",
                        Value: "mat020",
                    };
                    if (radio.value === "Nautical") {
                        const activeCoperta = document.querySelector(".coperta .texture-wrapper.active");

                        if (activeCoperta) {
                            const mat = activeCoperta.dataset.mat;
                            dataBottom = {
                                Type: 2,
                                Key: "Hull6 : 0",
                                Value: mat,
                            };
                        }
                    }
                    console.log("Sending material dataTop:", dataTop);
                    cloudstream.sendJsonData(dataTop);
                    console.log("Sending material dataBottom:", dataBottom);
                    cloudstream.sendJsonData(dataBottom);
                }
            });
        });

        document.querySelectorAll(".ante-cucina-selector input[type=radio]").forEach((radio) => {
            radio.addEventListener("change", () => {
                if (radio.checked) {
                    let data = {
                        Type: 2,
                        Key: "Hull2 : 3",
                        Value: "mat002",
                    };

                    if (radio.value === "No") {
                        const activeCucina = document.querySelector(".cucina .texture-wrapper.active");

                        if (activeCucina) {
                            const mat = activeCucina.dataset.mat;
                            data = {
                                Type: 2,
                                Key: "Hull2 : 3",
                                Value: mat,
                            };
                        }
                    }
                    console.log("Sending material data:", data);
                    cloudstream.sendJsonData(data);
                }
            });
        });

        document.querySelectorAll(".interior-scenes-container.moq").forEach((container) => {
            const label = container.previousElementSibling;
            const wrappers = container.querySelectorAll(".essenza-scene.img-wrapper");

            wrappers.forEach((wrapper) => {
                wrapper.addEventListener("click", () => {
                    wrappers.forEach((w) => w.classList.remove("active"));
                    wrapper.classList.add("active");

                    const wrapData = wrapper.dataset.moq;

                    let data = {
                        Type: 2,
                        Key: "Cabin5 : 10",
                        Value: "mat001",
                    };

                    let data1 = {
                        Type: 2,
                        Key: "Cabin2 : 14",
                        Value: "mat001",
                    };

                    let data2 = {
                        Type: 2,
                        Key: "Cabin2 : 9",
                        Value: "mat001",
                    };

                    if (wrapData === "No") {
                        // Find active Essenza
                        const activeEssenza = document.querySelector(
                            ".interior-scenes-container.essenza .img-wrapper.active"
                        );

                        if (activeEssenza) {
                            const essenzaName = activeEssenza.dataset.name;
                            if (essenzaName === "F002" || essenzaName === "F000") {
                                data.Value = "mat002";
                                data1.Value = "mat002";
                                data2.Value = "mat002";
                            } else if (essenzaName === "F003" || essenzaName === "F001") {
                                data.Value = "mat003";
                                data1.Value = "mat003";
                                data2.Value = "mat003";
                            }
                        }
                    }

                    console.log("Sending material data:", data);
                    cloudstream.sendJsonData(data);
                    cloudstream.sendJsonData(data1);
                    cloudstream.sendJsonData(data2);

                    if (label && label.classList.contains("normal")) {
                        label.textContent = wrapData;
                    }
                });
            });
        });

        document.querySelectorAll(".interior-scenes-container.essenza").forEach((container) => {
            const label = container.previousElementSibling; // .scene-label.normal
            const wrappers = container.querySelectorAll(".img-wrapper");

            wrappers.forEach((wrapper) => {
                wrapper.addEventListener("click", () => {
                    wrappers.forEach((w) => w.classList.remove("active"));
                    wrapper.classList.add("active");

                    // update label text
                    if (label && label.classList.contains("normal")) {
                        label.textContent = wrapper.dataset.name;
                    }

                    // pick correct materials
                    let selectedMaterials = [];
                    if (wrapper.dataset.name === "F002") {
                        selectedMaterials = materialsF002;
                    } else if (wrapper.dataset.name === "F003") {
                        selectedMaterials = materialsF003;
                    }

                    // send each material
                    selectedMaterials.forEach((m) => {
                        const data = {
                            Type: 2,
                            Key: m.Key,
                            Value: m.Value,
                        };
                        console.log("Sending Essenza material:", data);
                        cloudstream.sendJsonData(data);
                    });
                });
            });
        });
    });

    cloudstream.addEventListener("jsondatareceived", (args) => {
        // Get the text from the message and convert to json object
        console.warn(args);
        const data = JSON.parse(args);
        console.log(data);
        // display as string
        const jsonString = JSON.stringify(data);
        console.warn("jsondatareceived", jsonString);
        //print it
        console.log(jsonString);
    });

    //Connecting to the stream
    //    - options contains parent DOM element name to attach to
    cloudstream.connect(cloudstreamSettings);
});
