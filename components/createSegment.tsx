import { useState } from "react"
import { AddIcon } from '@bigcommerce/big-design-icons'
import { Box, AlertsManager, AlertProps, createAlertsManager, H2, Form, FormGroup, Input, Button, Textarea } from "@bigcommerce/big-design"

const alertsManager = createAlertsManager()

const CreateSegment = ({
    encodedContext,
    onCancel,
    mutateSegments,
    addAlert
}) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)

    const handleClick = async (e) => {
        e.preventDefault()
        setLoading(true)
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
            if(res.status != 200) {
                throw new Error(`Error creating segment${data.message ? `: ${data.message}` : ''}`)
            }
            console.log(data)
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
            setLoading(false)
        }
    }

    return <Box marginTop="large">
        <AlertsManager manager={alertsManager} />
        <H2>Create a Segment</H2>
        <Form>
            <FormGroup>
                <Input 
                    label="Segment Name"
                    placeholder="My Segment"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={loading}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Textarea 
                    label="Description"
                    placeholder="A segment for super special customers"
                    resize={true}
                    rows={4}
                    value={description}
                    disabled={loading}
                    onChange={e => setDescription(e.target.value)}
                />
            </FormGroup>
            <Button
                iconLeft={<AddIcon /> }
                isLoading={loading}
                onClick={handleClick}
            >
                    Create Segment
            </Button>
            <Button
                variant="secondary"
                onClick={onCancel}
            >
                Cancel
            </Button>
        </Form>
    </Box>
}

export default CreateSegment