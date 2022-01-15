import React, { useState, useEffect } from 'react'
import ReactModal from 'react-modal-resizable-draggable'
import $ from 'jquery'
import shortid from 'shortid'
import { connectController } from '../../controller'
import './styles.css'
import { Button } from '../../..'

const DialogContainer = ({
  terminalVisible,
  currentLevel,
  dialog,
  globalGameActions,
  actions,
  parentProps
}) => {
  // TODO: move this into redux
  const [uniqueWindowId, setUniqueWindowIdentifier] = useState(shortid.generate())

  const scrollToBottom = _elementSelector => {
    console.log('-> scrollToBottom()')
    let elementSelector = `#terminalDialogContainer .flexible-modal .content`
    if (_elementSelector) elementSelector = _elementSelector
    const { scrollHeight } = $(elementSelector)[0]
    $(elementSelector).animate({ scrollTop: scrollHeight }, 'slow')
  }

  useEffect(() => {
    scrollToBottom()
  }, [dialog.currentDialogIndex])

  const { currentDialog, currentDialogIndex, dialogIndexMap, dialogPathsVisibleToUser } = dialog

  // add isVisibleToUser flag to all dialog parts where 'dialogPathId' is not included in dialogPathsVisibleToUser[]
  const filteredDialog = currentDialog.map((dialogStep, index) => {
    const reachedIndex = index <= currentDialogIndex
    const isVisibleToUser =
      dialogPathsVisibleToUser.includes(dialogStep.dialogPathId) && reachedIndex
    return {
      ...dialogStep,
      isVisibleToUser
    }
  })

  return (
    <span id='terminalDialogContainer'>
      {terminalVisible && (
        <ReactModal
          className={uniqueWindowId}
          top={10}
          left='0'
          initHeight={700}
          initWidth={450}
          isOpen
        >
          <>
            <div
              className='background-image'
              style={{
                height: '100%',
                overflowY: 'scroll',
                background: 'url(./assets/trimmed/terminal_trimmed.png)',
                backgroundSize: '100% 100%'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '0',
                right: 0,
                width: '100%',
                // height: '600px',
                height: '63%',
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'flex-end',

                marginTop: '50%',
                paddingLeft: '10%',
                paddingRight: '20%'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  placeContent: 'flex-end',
                  overflow: 'auto',
                  // for firefox
                  minHeight: 0
                }}
              >
                <div
                  className='content'
                  style={{
                    float: 'left',
                    width: '100%',
                    marginTop: '15px',
                    overflowY: 'scroll'
                  }}
                >
                  {filteredDialog.map((dialogStep, index) => {
                    const isLastVisibleDialog = index === currentDialogIndex
                    const isFinalDialog = index === dialog.length - 1

                    const {
                      components: { dialog: dialogComp, choices: choicesComp } = {},
                      dialogPathId,
                      isVisibleToUser
                    } = dialogStep || {}

                    return (
                      <>
                        {dialogComp &&
                          isVisibleToUser &&
                          dialogComp({
                            dialog,
                            isLastVisibleDialog,
                            globalGameActions,
                            ...parentProps
                          })}
                      </>
                    )
                  })}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {filteredDialog.map((dialogStep, index) => {
                  const isLastVisibleDialog = index === currentDialogIndex
                  const isFinalDialog = index === dialog.length - 1

                  const {
                    components: { dialog: dialogComp, choices: choicesComp } = {},
                    dialogPathId,
                    isVisibleToUser
                  } = dialogStep || {}

                  return (
                    <>
                      {choicesComp &&
                        isVisibleToUser &&
                        choicesComp({
                          dialog,
                          isLastVisibleDialog,
                          globalGameActions,
                          ...parentProps
                        })}
                      {!choicesComp && isLastVisibleDialog && (
                        <Button onClick={() => globalGameActions.dialog.continueDialog()}>
                          Continue
                        </Button>
                      )}
                    </>
                  )
                })}
              </div>
            </div>
          </>
        </ReactModal>
      )}
    </span>
  )
}

export default connectController(DialogContainer)
