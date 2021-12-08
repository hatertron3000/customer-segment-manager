import { AlertProps, AlertsManager, Box, createAlertsManager, H2 } from "@bigcommerce/big-design"
import SegmentEditor from './segmentEditor'

const alertsManager = createAlertsManager()

const CreateSegment = ({
    encodedContext,
    onCancel,
    mutateSegments,
    addAlert
}) => {

    const handleClick = async ({ name, description }) => {
        try {
            const body = JSON.stringify([
                {
                    name,
                    description,
                }
            ]),
                options = {
                    method: 'POST',
                    body,
                    headers: {
                        "content-type": "application/json"
                    }
                },
                url = `/api/segments?context=${encodedContext}`

            const res = await fetch(url, options)
            const data = await res.json()
            if (res.status != 200) {
                throw new Error(`Error creating segment${data.message ? `: ${data.message}` : ''}`)
            }
            const alert = {
                header: 'Success',
                autoDismiss: true,
                messages: [
                    {
                        text: `Created segment: ${name}`
                    }
                ],
                type: 'success',
                onClose: () => null,
            } as AlertProps
            addAlert(alert)
            await mutateSegments()
            onCancel()
        } catch (err) {
            console.error(err)
            const alert = {
                header: 'Error creating segment',
                messages: [
                    {
                        text: err.message
                    }
                ],
                type: 'error',
                onClose: () => null,
            } as AlertProps
            addAlert(alert)
        }
    }

    return <Box marginTop="large">
        <AlertsManager manager={alertsManager} />
        <H2>Create a Segment</H2>
        <SegmentEditor
            onSave={handleClick}
            onCancel={onCancel}
            saveText="Save Segment"
            segment={{ name: "", description: "" }}
        />
    </Box>
}

export default CreateSegment