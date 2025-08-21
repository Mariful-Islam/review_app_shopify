import {
  Button,
  Modal,
  DropZone,
  Checkbox,
  Frame,
} from '@shopify/polaris';

export function DeleteConsentModal({isOpen, onClose}) {

    console.log(isOpen, onClose, "pppppppppppp")


  return (
    <div style={{height: '500px'}}>
      <Frame>
        <Modal
          size="small"
          open={isOpen}
        //   activator={<div onClick={}>opn</div>}
          onClose={onClose}
          title="Delete"
          primaryAction={{
            content: 'Delete',
            onAction: onClose,
            destructive: true
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: onClose,
            },
          ]}
        >
          <Modal.Section>
             helooooooooooooooo
  
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}