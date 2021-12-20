import { Viewer } from './viewer'
import { ViewerCamera } from './viewerCamera'
import { InputKeyboard } from './inputKeyboard'
import { InputTouch } from './inputTouch'
import { InputMouse } from './inputMouse'

export class ViewerInput {
  // Dependencies
  private canvas: HTMLCanvasElement

  // State
  private unregisters: Function[]
  private touch: InputTouch
  private mouse: InputMouse
  private keyboard: InputKeyboard

  constructor (canvas: HTMLCanvasElement, camera: ViewerCamera, viewer: Viewer) {
    this.canvas = canvas
    this.unregisters = []
    this.mouse = new InputMouse(camera, canvas, viewer)
    this.touch = new InputTouch(camera, viewer, this.mouse)
    this.keyboard = new InputKeyboard(camera, viewer, this.mouse)
  }

  private reg = (
    // eslint-disable-next-line no-undef
    handler: DocumentAndElementEventHandlers,
    type: string,
    listener: (event: any) => void
  ) => {
    handler.addEventListener(type, listener)
    this.unregisters.push(() => handler.removeEventListener(type, listener))
  }

  register () {
    // mouse
    this.reg(this.canvas, 'mousedown', this.mouse.onMouseDown)
    this.reg(this.canvas, 'wheel', this.mouse.onMouseWheel)
    this.reg(this.canvas, 'mousemove', this.mouse.onMouseMove)
    this.reg(this.canvas, 'mouseup', this.mouse.onMouseUp)
    this.reg(this.canvas, 'mouseout', this.mouse.onMouseOut)
    this.reg(this.canvas, 'dblclick', this.mouse.onDoubleClick)

    // touch
    this.reg(this.canvas, 'touchstart', this.touch.onTouchStart)
    this.reg(this.canvas, 'touchend', this.touch.onTouchEnd)
    this.reg(this.canvas, 'touchmove', this.touch.onTouchMove)

    // keys
    this.reg(document, 'keydown', this.keyboard.onKeyDown)
    this.reg(document, 'keyup', this.keyboard.onKeyUp)

    // Disable right click menu
    this.reg(this.canvas, 'contextmenu', (e) => e.preventDefault())
  }

  unregister = () => {
    this.unregisters.forEach((f) => f())
    this.reset()
  }

  reset () {
    this.mouse.reset()
    this.keyboard.reset()
    this.touch.reset()
  }
}
