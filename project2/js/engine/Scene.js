//SCENE CREATOR//

class Scene {

  constructor() {
    this.physicsSolver = new PhysicsSolver();
    this.gameObjects = new AsyncArray();
    this.keyboardFocus = [];
  }

  //WHEN SCENE IS STARTED//
  start() {
    this.gameObjects.start();
  }

  //ADD GAME OBJECT INTO SCENE//
  addGameObject(obj) {
    if(!(obj instanceof GameObject)){
      throw "Object is not a GameObject";
    }
    if(obj.parent != null){
      throw "Object added to scene cannot have a parent";
    }
    obj.scene = this;
    this.gameObjects.add(obj);
  }

  //QUEUES GAME OBJECT FOR REMOVAL FROM SCENE BUT WILL NOT REMOVE UNLESS TOLD TO OR SCENE IS ENDED//
  removeGameObject(obj) {
    this.gameObjects.remove(obj);
  }

  //UPDATES GAME OBJECT FOR EVERY SCENE//
  update() {
    this.gameObjects.update();
    this.physicsSolver.solve(this);
  }

  //CLOSES OUT SCENE UPON TERMINATION//
  end() {
    this.gameObjects.end();
  }

  createImageGameObject(image, x, y, z, scale, angle, parentGO) {

    let go = new GameObject();
    let goTransform = new Transform();
    go.addComponent(goTransform);
    goTransform.local.setPosition(x,y,z);
    goTransform.local.setScale(scale, scale);
    goTransform.local.setRotation(angle);
    go.addComponent(new ImageComponent(image));

    if (parentGO != null) {

      parentGO.addChild(go);
    } else {
      this.addGameObject(go);
    }
    return go;
  }

  getFirstGameObjectWithComponentType(compType) {

    for (let i = 0; i < this.gameObjects.active.length; i++) {

      let go = this.gameObjects.active[i];
      let comp = go.components.getFirstElementOfType(compType);

      if (comp != null) {
        return go;
      }
    }

    return null;
  }
  hasFocus(focusRequest, focusGave){
    return focusRequest == focusGave || focusGave == null;
  }
  isFocusIn(focusRequest, focusBefore, focusAfter){
    return !this.hasFocus(focusRequest, focusBefore) && this.hasFocus(focusRequest, focusAfter);
  }
  isFocusOut(focusRequest, focusBefore, focusAfter){
    return this.hasFocus(focusRequest, focusBefore) && !this.hasFocus(focusRequest, focusAfter);
  }
  getKeyboardFocus(){
    if(this.keyboardFocus.length == 0) return "";
    return this.keyboardFocus[this.keyboardFocus.length-1];
  }
  pushKeyboardFocus(name){
    let prevFocus = this.getKeyboardFocus();
    this.keyboardFocus.push(name);
    console.log("pushKeyboardFocus '"+prevFocus+"' -> '" + name + "'");
    this.updateKeyboardFocus(prevFocus, name);
  }
  popKeyboardFocus(name){
    if(this.keyboardFocus.length == 0) throw "Cannot pop keyboard focus as there are no current focus";
    let prevFocus = this.keyboardFocus.pop();
    let curFocus = this.getKeyboardFocus();
    console.log("popKeyboardFocus '" + prevFocus + "' -> '" + curFocus + "'");
    this.updateKeyboardFocus(prevFocus, curFocus);
    return prevFocus;
  }
  updateKeyboardFocus(focusBefore, focusAfter){
    for(let k = 0; k != this.gameObjects.active.length; k++){
      let kbComps = this.gameObjects.active[k].components.getAllElementOfType(KeyboardEventComponent);
      for(let i = 0; i != kbComps.length; i++){
        if(this.isFocusIn(kbComps[i].focus, focusBefore, focusAfter)){
          kbComps[i].onFocusIn();
        } else if(this.isFocusOut(kbComps[i].focus, focusBefore, focusAfter)){
          kbComps[i].onFocusOut();
        }
      }
    }
  }
}
