import { Button, Form, FormGroup, Input, Textarea } from "@bigcommerce/big-design"
import { AddIcon } from '@bigcommerce/big-design-icons'
import { useState } from "react"

const SegmentEditor = ({
    onSave,
    saveText,
    onCancel,
    segment
}) => {
    const [name, setName] = useState(segment.name)
    const [description, setDescription] = useState(segment.description)
    const [loading, setLoading] = useState(false)


    return <Form>
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
            iconLeft={<AddIcon />}
            isLoading={loading}
            onClick={async (e) => {
                e.preventDefault()
                setLoading(true)
                await onSave({ name, description })
                setLoading(false)
            }}
        >
            {saveText}
        </Button>
        <Button
            variant="secondary"
            onClick={onCancel}
        >
            Cancel
        </Button>
    </Form>
}

export default SegmentEditor