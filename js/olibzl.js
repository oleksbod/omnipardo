// F002 set
const materialsF002 = [
    { Type: 2, Key: "Cabin5 : 10", Value: "mat055" },
    { Type: 2, Key: "Cabin5 : 9", Value: "mat002" },
    { Type: 2, Key: "Cabin2 : 14", Value: "mat055" },
    { Type: 2, Key: "Cabin2 : 9", Value: "mat002" },
    { Type: 2, Key: "Cabin3 : 7", Value: "mat055" },
    { Type: 2, Key: "Cabin5 : 0", Value: "mat003" },
    { Type: 2, Key: "Cabin3 : 3", Value: "mat003" },
    { Type: 2, Key: "Cabin2 : 4", Value: "mat003" },
    { Type: 2, Key: "Cabin3 : 5", Value: "mat004" },
    { Type: 2, Key: "Cabin5 : 1", Value: "mat007" },
    { Type: 2, Key: "Cabin1 : 2", Value: "mat007" },
    { Type: 2, Key: "Cabin1 : 1", Value: "mat002" },
    { Type: 2, Key: "Cabin2 : 6", Value: "mat007" },
];

// F003 set
const materialsF003 = [
    { Type: 2, Key: "Cabin5 : 10", Value: "mat056" },
    { Type: 2, Key: "Cabin5 : 9", Value: "mat003" },
    { Type: 2, Key: "Cabin2 : 14", Value: "mat056" },
    { Type: 2, Key: "Cabin2 : 9", Value: "mat003" },
    { Type: 2, Key: "Cabin3 : 7", Value: "mat056" },
    { Type: 2, Key: "Cabin5 : 0", Value: "mat002" },
    { Type: 2, Key: "Cabin3 : 3", Value: "mat002" },
    { Type: 2, Key: "Cabin2 : 4", Value: "mat002" },
    { Type: 2, Key: "Cabin3 : 5", Value: "mat005" },
    { Type: 2, Key: "Cabin5 : 1", Value: "mat006" },
    { Type: 2, Key: "Cabin1 : 2", Value: "mat006" },
    { Type: 2, Key: "Cabin1 : 1", Value: "mat003" },
    { Type: 2, Key: "Cabin2 : 6", Value: "mat006" },
];

const loader = document.getElementById("pageLoader");
const loaderText = loader?.querySelector(".loader-text");

window.showLoader = function (opts = {}) {
    if (!loader) return;
    const { text, blockPointerEvents = true } = opts;
    if (text && loaderText) loaderText.textContent = text;
    loader.classList.add("is-visible");
    loader.setAttribute("aria-hidden", "false");
    if (blockPointerEvents) {
        // prevent interacting with page while loader visible
        loader.style.pointerEvents = "auto";
    } else {
        loader.style.pointerEvents = "none";
    }
    // optionally prevent scroll while visible
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
};

window.hideLoader = function () {
    if (!loader) return;
    loader.classList.remove("is-visible");
    loader.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    // restore default label
    if (loaderText) loaderText.textContent = "Loading…";
};

showLoader();

let defaultSettings = {};
let currentSettings = {};

// helpers (зберігаємо ключи як у DOM — з ";" якщо є)
function makeMatObj(mesh, mat) {
    return { Type: 2, Key: mesh, Value: mat };
}
function makeSceneObj(val) {
    return { Type: 1, Key: "", Value: val };
}

// Збери дефолти з усіх контейнерів, що мають id і відповідають структурі
function collectDefaults() {
    defaultSettings = {};

    // вибираємо контейнери з id, які використовуються як блоки настроювань
    const containers = document.querySelectorAll(".exterior-scenes-container[id], .interior-scenes-container[id]");

    containers.forEach((container) => {
        const id = container.id;
        if (!id) return;

        // ESSENZA (спеціальна логіка)
        if (container.classList.contains("essenza")) {
            const activeEss = container.querySelector(".img-wrapper.active") || container.querySelector(".img-wrapper");
            let essName = activeEss?.dataset.name;

            // fallback: визначити по активній внутрішній сцені
            if (!essName) {
                const activeInterior = document.querySelector(".interior-scenes-container .scene.active");
                essName = activeInterior && activeInterior.dataset.name === "Dinette" ? "F002" : "F000";
            }

            if (essName === "F002" || essName === "F000") {
                // materialsF002 має бути визначений вище в твоєму коді
                defaultSettings[id] =
                    typeof materialsF002 !== "undefined" ? JSON.parse(JSON.stringify(materialsF002)) : [];
            } else {
                defaultSettings[id] =
                    typeof materialsF003 !== "undefined" ? JSON.parse(JSON.stringify(materialsF003)) : [];
            }

            return;
        }

        // MOQUETTE (moq) — створює 3 Type:2 записи як у твоєму js
        if (container.classList.contains("moq") || id.toLowerCase().includes("moquette")) {
            const activeMoq = container.querySelector(".img-wrapper.active") || container.querySelector(".img-wrapper");
            const moqVal = activeMoq?.dataset.moq || "Si";

            const data = { Type: 2, Key: "Cabin5 : 10", Value: "mat001" };
            const data1 = { Type: 2, Key: "Cabin2 : 14", Value: "mat001" };
            const data2 = { Type: 2, Key: "Cabin2 : 9", Value: "mat001" };

            if (moqVal === "No") {
                const activeEss =
                    document.querySelector(".interior-scenes-container.essenza .img-wrapper.active") ||
                    document.querySelector(".interior-scenes-container.essenza .img-wrapper");
                const essName = activeEss?.dataset.name;

                if (essName === "F002" || essName === "F000") {
                    data.Value = data1.Value = data2.Value = "mat002";
                } else if (essName === "F003" || essName === "F001") {
                    data.Value = data1.Value = data2.Value = "mat003";
                }
            }

            defaultSettings[id] = [data, data1, data2];
            return;
        }

        // COCKPIT (radio container) — відправляє 2 Type:2 (top + bottom)
        if (id === "cockpit" || container.classList.contains("cockpit-selector")) {
            const radio = container.querySelector("input[type=radio]:checked");
            const dataTop = { Type: 2, Key: "Hull1 : 3", Value: "mat021" };
            let dataBottom = { Type: 2, Key: "Hull1 : 0", Value: "mat020" };

            if (radio && radio.value === "Nautical") {
                const activeCoperta = document.querySelector(".coperta .texture-wrapper.active");
                if (activeCoperta) dataBottom.Value = activeCoperta.dataset.mat;
            }

            defaultSettings[id] = [dataTop, dataBottom];
            return;
        }

        // ANTE CUCINA (radio) — Key = "Hull2 : 3"
        if (id === "anteCucina" || container.classList.contains("ante-cucina-selector")) {
            const radio = container.querySelector("input[type=radio]:checked");
            let data = { Type: 2, Key: "Hull2 : 3", Value: "mat002" }; // js default mat002

            if (radio && radio.value === "No") {
                const activeCucina = document.querySelector(".cucina .texture-wrapper.active");
                if (activeCucina) data.Value = activeCucina.dataset.mat;
            }

            defaultSettings[id] = data;
            return;
        }

        // ЗАГАЛЬНА ЛОГІКА: texture-wrapper.active або img-wrapper.active
        const activeTex = container.querySelector(
            ".texture-wrapper.active, .img-wrapper.active, .essenza-scene.img-wrapper.active"
        );
        if (activeTex) {
            if (activeTex.classList.contains("texture-wrapper")) {
                const meshRaw = activeTex.getAttribute("data-mesh") || activeTex.dataset.mesh || "";
                const mat = activeTex.dataset.mat || activeTex.getAttribute("data-mat") || "";
                defaultSettings[id] = { Type: 2, Key: meshRaw, Value: mat };
            } else {
                // наприклад interior scene (звичайний вибір моделі) — збережемо як Type:1
                const name = activeTex.dataset.name || activeTex.dataset.moq || "";
                defaultSettings[id] = makeSceneObj(name);
            }
        }
    });

    // Копіюємо у currentSettings
    currentSettings = structuredClone(defaultSettings);

    console.log("Collected defaultSettings:", defaultSettings);
    return defaultSettings;
}

// Функція оновлення поточної копії (викликати при зміні елементів)
function updateCurrentSettings(parentId, data) {
    if (!parentId) return;
    currentSettings[parentId] = data;
}

// (Опціонально) функція — відправити весь currentSettings на cloudstream (викликати коли потрібно)
function sendSettingsToCloud(settings) {
    Object.values(settings).forEach((entry) => {
        if (Array.isArray(entry)) {
            entry.forEach((d) => sendDataEntry(d));
        } else if (entry && typeof entry === "object") {
            sendDataEntry(entry);
        }
    });
}
// допоміжна — враховує Key з ";" (декілька mesh)
function sendDataEntry(d) {
    if (d.Type === 2 && d.Key && d.Key.includes(";")) {
        const meshes = d.Key.split(";").map((m) => m.trim());
        meshes.forEach((mesh) => {
            const data = { ...d, Key: mesh };
            cloudstream.sendJsonData(data);
        });
    } else {
        cloudstream.sendJsonData(d);
    }
}

// Викликати при завантаженні
document.addEventListener("DOMContentLoaded", () => {
    collectDefaults();
});

const libzl = new LibZL();

const cloudstreamSettings = {
    directConnection: false,
    cloudConnectionParameters: {
        customer: "omnistream",
        renderService: "078fc39dtestser",
    },
    streamingMode: "video",
    parent: "streamContainer",
    fakeMouseWithTouch: true,
};

libzl.cloudstream("cloudstreamExample").then(function (api) {
    //Adding to the global namespace
    cloudstream = window.cloudstream = api;

    //Adding event listeners to what we're interested in
    cloudstream.addEventListener("error", function (error) {
        console.error("OmniStream had an error: ", error);
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

                const activeCamera = document.querySelector(".camera.active");
                const cameraInterior = document.querySelector('.camera[data-camera="Interior"]');
                const cameraPoppa = document.querySelector('.camera[data-camera="Poppa"]');

                if (scene.dataset.name === "Dinette" || scene.dataset.name === "Cabin") {
                    // Якщо камери не Interior і не FPC → міняємо на Interior
                    if (
                        activeCamera &&
                        activeCamera.dataset.camera !== "Interior" &&
                        activeCamera.dataset.camera !== "FPC"
                    ) {
                        activeCamera.classList.remove("active");
                        cameraInterior.classList.add("active");
                        let camera = {
                            Type: 0,
                            Key: "",
                            Value: "Interior",
                        };

                        cloudstream.sendJsonData(camera);
                    }
                }

                if (scene.dataset.name === "Entrobordo" || scene.dataset.name === "Fuoribordo") {
                    // Якщо камери не Poppa і не FPC → міняємо на Poppa
                    if (
                        activeCamera &&
                        activeCamera.dataset.camera !== "Poppa" &&
                        activeCamera.dataset.camera !== "FPC"
                    ) {
                        activeCamera.classList.remove("active");
                        cameraPoppa.classList.add("active");

                        let camera = {
                            Type: 0,
                            Key: "",
                            Value: "Poppa",
                        };

                        cloudstream.sendJsonData(camera);
                    }
                }
                // get combined value
                const activeEx = document.querySelector(".exterior-scenes-container .scene.active");
                const activeIn = document.querySelector(".interior-scenes-container .scene.active");

                const exValue = activeEx ? activeEx.dataset.exscene : "";
                const inValue = activeIn ? activeIn.dataset.name : "";

                const value = exValue && inValue ? `${exValue}_${inValue}` : exValue || inValue;

                const data = {
                    Type: 1,
                    Key: "",
                    Value: value,
                };
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

                            cloudstream.sendJsonData(data);
                        }
                    }

                    const parentWithId = wrapper.closest("[id]");
                    if (parentWithId) {
                        const pid = parentWithId.id;
                        // головний об'єкт (зберігаємо "сирий" data-mesh зі всіма ';' як у DOM)

                        const main = {
                            Type: 2,
                            Key: wrapper.getAttribute("data-mesh") || wrapper.dataset.mesh,
                            Value: wrapper.dataset.mat,
                        };

                        if (pid === "coperta") {
                            const activeCockpitRadio = document.querySelector(
                                ".cockpit-selector input[type=radio]:checked"
                            );

                            if (activeCockpitRadio && activeCockpitRadio.value === "Nautical") {
                                const dataTop = {
                                    Type: 2,
                                    Key: "Hull1 : 3",
                                    Value: "mat021",
                                };
                                const dataBottom = {
                                    Type: 2,
                                    Key: "Hull1 : 0",
                                    Value: wrapper.dataset.mat,
                                };

                                cloudstream.sendJsonData(dataTop);
                                cloudstream.sendJsonData(dataBottom);

                                updateCurrentSettings("cockpit", [dataTop, dataBottom]);
                            }
                        }
                        // якщо cucina і ante = No — зберігаємо додатково Hull2 : 3
                        if (wrapper.dataset.cucina === "true") {
                            const anteNo = document.querySelector(".ante-cucina-selector input[value='No']:checked");
                            if (anteNo) {
                                updateCurrentSettings(pid, [
                                    main,
                                    { Type: 2, Key: "Hull2 : 3", Value: wrapper.dataset.mat },
                                ]);
                            } else {
                                updateCurrentSettings(pid, main);
                            }
                        } else {
                            updateCurrentSettings(pid, main);
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
                            dataBottom.Value = mat;
                        }
                    }

                    cloudstream.sendJsonData(dataTop);

                    cloudstream.sendJsonData(dataBottom);
                    updateCurrentSettings("cockpit", [dataTop, dataBottom]);
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

                    cloudstream.sendJsonData(data);
                    updateCurrentSettings("anteCucina", data);
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
                                data.Value = "mat055";
                                data1.Value = "mat055";
                                data2.Value = "mat055";
                            } else if (essenzaName === "F003" || essenzaName === "F001") {
                                data.Value = "mat056";
                                data1.Value = "mat056";
                                data2.Value = "mat056";
                            }
                        }
                    }

                    cloudstream.sendJsonData(data);
                    cloudstream.sendJsonData(data1);
                    cloudstream.sendJsonData(data2);

                    updateCurrentSettings("moquette", [data, data1, data2]);

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
                    if (wrapper.dataset.name === "F002" || wrapper.dataset.name === "F000") {
                        selectedMaterials = materialsF002;
                    } else if (wrapper.dataset.name === "F003" || wrapper.dataset.name === "F001") {
                        selectedMaterials = materialsF003;
                    }

                    const activeMoq = document.querySelector("#moquette .essenza-scene.active");
                    const moqValue = activeMoq ? activeMoq.dataset.moq : "No";

                    const excludedKeysWhenMoqSi = ["Cabin5 : 10", "Cabin2 : 14", "Cabin2 : 9"];

                    // send each material
                    selectedMaterials.forEach((m) => {
                        if (moqValue === "Si" && excludedKeysWhenMoqSi.includes(m.Key)) {
                            return;
                        }
                        const data = {
                            Type: 2,
                            Key: m.Key,
                            Value: m.Value,
                        };

                        cloudstream.sendJsonData(data);
                    });

                    updateCurrentSettings("essenza", selectedMaterials);
                });
            });
        });
    });

    if (streamContainer) {
        let isMouseInContainer = false;

        // Track mouse enter/leave for container
        streamContainer.addEventListener("mouseenter", () => {
            isMouseInContainer = true;
            const data = {
                Type: 4,
                Key: "",
                Value: "FOCUS_ON",
            };
            cloudstream.sendJsonData(data);
        });

        streamContainer.addEventListener("mouseleave", () => {
            isMouseInContainer = false;
            // Don't send FOCUS_OFF on mouseleave
        });

        // Send FOCUS_ON when mouse button is pressed inside container
        streamContainer.addEventListener("mousedown", () => {
            if (isMouseInContainer) {
                const data = {
                    Type: 4,
                    Key: "",
                    Value: "FOCUS_ON",
                };
                cloudstream.sendJsonData(data);
            }
        });

        // Send FOCUS_OFF when mouse button is released anywhere on the page
        document.addEventListener("mouseup", () => {
            const data = {
                Type: 4,
                Key: "",
                Value: "FOCUS_OFF",
            };
            cloudstream.sendJsonData(data);
        });
    }

    cloudstream.addEventListener("jsondatareceived", (args) => {
        // Get the text from the message and convert to json object
        console.warn(args);
        const data = JSON.parse(args);
        console.log(data);

        if (data?.Message === "SCENE_CHANGED") {
            sendSettingsToCloud(currentSettings);
        } else if (data?.Message === "CONNECTED") {
            const dataCam = {
                Type: 0,
                Key: "test",
                Value: "Orbit",
            };
            cloudstream.sendJsonData(dataCam);
            const data = {
                Type: 1,
                Key: "",
                Value: "P43_Entrobordo_Cabin",
            };
            cloudstream.sendJsonData(data);
            hideLoader();
        }
    });

    //Connecting to the stream
    //    - options contains parent DOM element name to attach to
    cloudstream.connect(cloudstreamSettings);
    //hideLoader();
});
