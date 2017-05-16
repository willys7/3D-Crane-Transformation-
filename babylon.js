        window.addEventListener('DOMContentLoaded', function(){
            var engine = new BABYLON.Engine(canvas, true);
            engine.enableOfflineSupport = false; // Dont require a manifest file
            var elements = [];

            var option = "";
            var scene = new BABYLON.Scene(engine);
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
                // Skybox
            var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
            var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            skyboxMaterial.disableLighting = true;
            skybox.material = skyboxMaterial;

            //Creo el agua como un nuevo material que se agrega a la escena
            var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 512, 512, 0, scene, false);
            var water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(512, 512));
            waterMesh.position.y=-1;
            water.backFaceCulling = true;
            water.bumpTexture = new BABYLON.Texture("sea.jpg", scene);
            water.windForce = -3;
            water.waveHeight = .2;
            water.bumpHeight = 0.1;
            water.windDirection = new BABYLON.Vector2(1, 1);
            water.waterColor = new BABYLON.Color3(0, 0, 221 / 255);
            water.colorBlendFactor = 0.0;
            water.addToRenderList(skybox);
            waterMesh.material = water;
            
            //Seteo la gravedad a mi escena
            scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
            scene.clearColor = new BABYLON.Color3.White();
            var camera = new BABYLON.ArcRotateCamera(
                "cam",
                BABYLON.Tools.ToRadians(145),
                BABYLON.Tools.ToRadians(45),
                20.0,
                BABYLON.Vector3.Zero(),
                scene
            );
            camera.attachControl(canvas,true);
            camera3 = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
            camera3.rotation = new BABYLON.Vector3(0, 9.5, 0);
            var camera4 = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
            

            BABYLON.SceneLoader.ImportMesh(
                "","","boat.babylon",
                scene,
                function(newMeshes) {
                    //console.log(newMeshes[0]);
                    var temp = [];
                    newMeshes.forEach(
                        function(mesh) {
                            //console.log(mesh.getWorldMatrix());
                            mesh.checkCollisions = true;
                            mesh.ellipsoid = new BABYLON.Vector3(10, 10, 10);
                            elements.push(mesh);
                        }
                    );
                    //elements = temp;
                }
            );
            scene.registerBeforeRender(function () {
                });
            var ground = null;
            scene.actionManager = new BABYLON.ActionManager(scene);
            upperCase = true;
            scaleFactor = 1.1;
            scaleSmallFactor = 0.9
            open = true;
            shift = true;
            option = elements[13];
            selectedBox = null;
            realSelectedBox = null;
            boatBoxes = []
            var getGroundPosition = function () {
                // Use a predicate to get position on the ground
                var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
                console.log(pickinfo);
                if (pickinfo.hit) {
                    return pickinfo.pickedPoint;
                }

                return null;
            }
            function getBoatCamera(item) {
                return item.id === "Camera";
            }
            var onKeyDown = function(evt) {
                console.log(elements);
                elements.forEach( function(e){
                    if(e.name == "Box")
                        box1 = e;
                    if(e.name == "Box1")
                        box2 = e;
                    if(e.name == "Box2")
                        box3 = e;
                    if(e.name == "Box3")
                        box4 = e;
                    if(e.name == "Box5")
                        box5 = e;
                    if(e.name == "boatFloor")
                        boatFloor = e;
                    if(e.name == "boat")
                        boat = e;
                    if(e.name == "crane1")
                        crane = e;
                    if(e.name == "crane2")
                        crane1 = e;
                    if(e.name == "crane3")
                        crane2 = e;
                    if(e.name == "crane4")
                        crane3 = e;
                    if(e.name == "port")
                        port = e;
                    if(e.name == "claw")
                        claw = e;

                });
                /*box1 = elements[22];
                box2 = elements[4];
                box3 = elements[6];
                box4 = elements[7];
                box5 = elements[3];
                ground = elements[1];
                boat = elements[23];//23
                boatFloor = elements[26];
                crane = elements[10]
                crane1 = elements[11];
                crane2 = elements[14];
                crane3 = elements[15];
                port = elements [5];
                claw = elements[16];*/
                switch(evt.keyCode){
                    case 87:// W-move-front-boat
                        translation(boat,evt.keyCode);
                        if(boatFloor.intersectsMesh(port, false)){
                            translation(boat, 83);
                            translation(boat, 83);
                        }
                        break;
                    case 83://S-move back boat
                        translation(boat,evt.keyCode);
                        if(boatFloor.intersectsMesh(port, false)){
                            translation(boat, 87);
                            translation(boat, 87);
                        }
                        break;  
                    case 65://A move left boat
                        boat.rotate(BABYLON.Axis.Y, -0.1, BABYLON.Space.LOCAL);
                        if(boatFloor.intersectsMesh(port, false))
                            boat.rotate(BABYLON.Axis.Y, 0.2, BABYLON.Space.LOCAL);

                        break;
                    case 68://D move right boat
                        boat.rotate(BABYLON.Axis.Y, 0.1, BABYLON.Space.LOCAL); 
                        if(boatBoxes.length >0)
                            for (var i = 0; i < boatBoxes.length; i++) {
                                boatBoxes[i].rotate(BABYLON.Axis.Y, 0.1, BABYLON.Space.LOCAL);
                            }
                        if(boatFloor.intersectsMesh(port, false)){
                            boat.rotate(BABYLON.Axis.Y, -0.2, BABYLON.Space.LOCAL);
                            if(boatBoxes.length >0)
                                for (var i = 0; i < boatBoxes.length; i++) {
                                    boatBoxes[i].rotate(BABYLON.Axis.Y, -0.2, BABYLON.Space.LOCAL);
                                }
                        }
                        break;
                    case 81://Q rotate axis x house
                        break;
                    case 69://E rotate axis y house
                        house.rotate(BABYLON.Axis.Y, 1.0, BABYLON.Space.LOCAL);
                        break;
                    case 82://R rotate axis z house
                        house.rotate(BABYLON.Axis.Z, 1.0, BABYLON.Space.LOCAL);
                        break;
                    case 88://X scale big x house
                        if(upperCase)
                            house.scaling.x = house.scaling.x * scaleFactor;
                        else
                            house.scaling.x = house.scaling.x * scaleSmallFactor;
                        break;
                    case 67://C scale big y house
                        if(upperCase)
                            house.scaling.y = house.scaling.y * scaleFactor;
                        else
                            house.scaling.y = house.scaling.y * scaleSmallFactor;
                        break;
                    case 90://Z scale big z house
                        if(upperCase)
                            house.scaling.z = house.scaling.z * scaleFactor;
                        else
                            house.scaling.z = house.scaling.z * scaleSmallFactor;
                        break;
                    case 119:// w-shear-up-house
                        break;
                    case 115:// s-shear down house
                        break;
                    case 97:// a shear left house
                        break;
                    case 100:// d shear right house
                        break;
                    case 73:// I-move-up-tree
                        selectedBox = null;
                        if(option === crane && option.rotationQuaternion.z <= -0.6051864057360401)
                            break;
                        option.rotate(BABYLON.Axis.Z, 0.1, BABYLON.Space.LOCAL); 
                        /*console.log(option.rotationQuaternion);
                        if(realSelectedBox != null){
                            realSelectedBox.position.x = claw.getAbsolutePosition().x;
                            realSelectedBox.position.y = claw.getAbsolutePosition().y - 0.1;
                            realSelectedBox.position.z = claw.getAbsolutePosition().z;
                        }*/
                        if(claw.intersectsMesh(port, false) || claw.intersectsMesh(boatFloor, false) || claw.intersectsMesh(crane, false))
                            option.rotate(BABYLON.Axis.Z, -0.2, BABYLON.Space.LOCAL);
                        break;
                    case 75://K-move down tree
                        if(claw.intersectsMesh(box1, true) && realSelectedBox == null){
                            selectedBox = box1;
                            //console.log("box1")
                            break;
                        }else if(claw.intersectsMesh(box2, true) && realSelectedBox == null){
                            selectedBox = box2;
                            //console.log("box2")
                            break;
                        }else if(claw.intersectsMesh(box3, true) && realSelectedBox == null){
                            selectedBox = box3;
                            //console.log("box3")
                            break;
                        }else if(claw.intersectsMesh(box4, true) && realSelectedBox == null){
                            selectedBox = box4;
                            //console.log("box4")
                            break;
                        }else if(claw.intersectsMesh(box5, true) && realSelectedBox == null){
                            selectedBox = box5;
                            //console.log("box5")
                            break;
                        }
                        selectedBox = null;
                        if(option === crane && option.rotationQuaternion.z >= 0.3894183423086516)
                            break;
                        /*if(option === crane1 && option.rotationQuaternion.z >= -0.9974949866040591)
                            break;*/
                        option.rotate(BABYLON.Axis.Z,-0.1, BABYLON.Space.LOCAL); 
                        console.log(option.rotationQuaternion);
                        /*if(realSelectedBox != null){
                            realSelectedBox.position.x = claw.getAbsolutePosition().x;
                            realSelectedBox.position.y = claw.getAbsolutePosition().y - 0.5;
                            realSelectedBox.position.z = claw.getAbsolutePosition().z;
                        }*/
                        if(claw.intersectsMesh(port, false) || claw.intersectsMesh(boatFloor, false) || claw.intersectsMesh(crane, false)){
                            option.rotate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                            console.log("last");
                        }
                        break;  
                    case 74://J move left tree
                        crane1.rotate(BABYLON.Axis.Y, -0.1, BABYLON.Space.LOCAL);
                        /*if(realSelectedBox != null){
                            realSelectedBox.position.x = claw.getAbsolutePosition().x;
                            realSelectedBox.position.y = claw.getAbsolutePosition().y - 0.25;
                            realSelectedBox.position.z = claw.getAbsolutePosition().z;
                        }*/
                        break;
                    case 76://L move right tree
                        crane1.rotate(BABYLON.Axis.Y, 0.1, BABYLON.Space.LOCAL);
                        /*if(realSelectedBox != null){
                            realSelectedBox.position.x = claw.getAbsolutePosition().x;
                            realSelectedBox.position.y = claw.getAbsolutePosition().y - 0.25;
                            realSelectedBox.position.z = claw.getAbsolutePosition().z;
                        }*/
                        break;
                    case 49:
                        option = crane;
                        break
                    case 50:
                        option = crane1;
                        break
                    case 51:
                        option = crane2;
                        break
                    case 52:
                        option = crane3;
                        break
                    case 86://open/close door
                        
                        break;
                    case 57:
                        if(selectedBox != null && realSelectedBox == null){
                            realSelectedBox = selectedBox;
                            if(realSelectedBox.parent != boatFloor){
                                realSelectedBox.position.x = claw.getAbsolutePosition().x;
                                realSelectedBox.position.y = claw.getAbsolutePosition().y - 0.8;
                                realSelectedBox.position.z = claw.getAbsolutePosition().z - 2;
                            }else{
                                realSelectedBox.position.x = claw.getAbsolutePosition().x +1;
                                realSelectedBox.position.y = claw.getAbsolutePosition().y - 0.9;
                                realSelectedBox.position.z = claw.getAbsolutePosition().z ;
                            }
                            realSelectedBox.parent = claw;
                            
                            
                        }
                        else if(realSelectedBox !== null && realSelectedBox.intersectsMesh(boatFloor, true)){
                                translation(realSelectedBox, 91);
                                translation(realSelectedBox, 91);
                                translation(realSelectedBox, 91);
                                translation(realSelectedBox, 91);
                                translation(realSelectedBox, 91);

                                realSelectedBox.parent = boatFloor;
                                for (var i = 0; i < (boatBoxes.length+1)*10; i++) {
                                    translation(realSelectedBox, 97);
                                }
                            realSelectedBox = null;
                        }
                        break;
                    case 54:
                        camera3.parent = boat;
                        scene.activeCamera = camera3;
                        break;
                    case 48:
                        camera4.parent = crane;
                        scene.activeCamera = camera4;
                        break;
                    case 55:
                        scene.activeCamera = camera;
                        break;
                    case 50:
                        shift = !shift;
                        break
                    default:
                        console.log(evt.keyCode);
                }
                
            }
            var translation = function(obj, movement){
                var transVector = new BABYLON.Vector3(0, 0, 0);
                switch(movement){
                    case 87:
                        transVector = new BABYLON.Vector3(1, 0, 0);
                        break;
                    case 83:
                        transVector = new BABYLON.Vector3(-1, 0, 0);
                        break;
                    case 65:
                        transVector = new BABYLON.Vector3(1, 0, 0);
                        break;
                    case 68:
                        transVector = new BABYLON.Vector3(-1, 0, 0);
                        break;
                    case 90:
                        transVector = new BABYLON.Vector3(0,-1,0);
                        break;
                    case 91:
                        transVector = new BABYLON.Vector3(0,1,0);
                        break;
                    case 92:
                        transVector = new BABYLON.Vector3(0,0,-1);
                        break;
                }
                var pivot = BABYLON.Matrix.Translation(0,0,0);
                obj.setPivotMatrix(pivot);
                obj.translate(transVector, 0.1, BABYLON.Space.LOCAL);
            }
            // On key up, reset the movement
            var onKeyUp = function(evt) {
            };
            // Register events with the right Babylon function
            BABYLON.Tools.RegisterTopRootEvents([{
                name: "keydown",
                handler: onKeyDown
            }, {
                name: "keyup",
                handler: onKeyUp
            }]);
            engine.runRenderLoop(function() {
                scene.render();
            });
        });
    