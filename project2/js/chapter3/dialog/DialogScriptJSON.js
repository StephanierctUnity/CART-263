
class DialogScriptJSON extends DialogScript{
  constructor(json){
    super();
    this.json = json;
    this.currentLine = 0;
    this.previousActor = "";
  }
  reset(){
    this.currentLine = 0;
    this.previousActor = "";
  }
  moveNextLine(){
    this.previousActor = this.getCurrentActor();
    this.currentLine++;
  }
  // when starting the first line of dialog from an actor
  // happens when script begin and when actor switch
  isNewActor(){
    return this.previousActor != this.getCurrentActor();
  }
  getCurrentLine(){
    return this.json.lines[this.currentLine].text;
  }
  getCurrentActor(){
    return this.json.lines[this.currentLine].actor;
  }
  isOver(){
      return this.currentLine >= this.json.lines.length;
  }
}
