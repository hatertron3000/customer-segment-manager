import {
    AlertProps,
    AlertsManager,
    Button,
    createAlertsManager,
    Dropdown,
    H2,
    H3,
    Modal,
    Panel,
    Link as StyledLink,
    Table,
    Text,
} from "@bigcommerce/big-design"
import { AddIcon, DeleteIcon, EditIcon, MoreHorizIcon } from '@bigcommerce/big-design-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement, useState } from "react"
import Loading from "@components/loading"
import { useSegments } from "@lib/hooks"
import { useSession } from "context/session"
import { SegmentTableItem } from "types/data"
import { Segment } from "types/segment"
import CreateSegment from '../components/createSegment'


const alertsManager = createAlertsManager()

const Segments = () => {
    const [adding, setAdding] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [segmentToDelete, setSegmentToDelete] = useState(null)
    const router = useRouter()
    const {
        segments,
        // segmentMeta,
        // segmentsLoading,
        // segmentError,
        mutateSegments,
    } = useSegments()
    const encodedContext = useSession()?.context;

    const handleDeleteSegment = async (): Promise<void> => {
        setDeleting(true)
        try {
            const url = `/api/segments?id:in=${segmentToDelete.id}&context=${encodedContext}`
            const res = await fetch(url, {
                method: 'DELETE'
            })
            const { errors } = await res.json()
            if (errors?.length)
                throw new Error(errors.toString())

            const alert = {
                header: 'Success',
                autoDismiss: true,
                messages: [
                    {
                        text: `Deleted segment: ${segmentToDelete.name}`
                    }
                ],
                type: 'success',
                onClose: () => null,
            } as AlertProps
            alertsManager.add(alert)
            setSegmentToDelete(null)
            mutateSegments()
        } catch (err) {
            console.error(err)
            const alert = {
                header: 'Error deleting segment',
                messages: [
                    {
                        text: err.message
                    }
                ],
                type: 'error',
                onClose: () => null,
            } as AlertProps
            alertsManager.add(alert)
            setSegmentToDelete(null)
            mutateSegments()
        }
        setDeleting(false)
    }

    const segmentItems: SegmentTableItem[] = segments?.map(({ id, name }: Segment) => (
        {
            id,
            name
        }
    ))

    const renderName = (id: string, name: string): ReactElement => (
        <Link href={`/segments/${id}`}>
            <StyledLink>{name}</StyledLink>
        </Link>
    )

    const renderAction = (id: string, name: string): ReactElement => (
        <Dropdown
            items={[
                { content: 'Edit Segment', onItemClick: () => router.push(`/segments/${id}`), hash: 'edit', icon: <EditIcon /> },
                { content: 'Delete Segment', onItemClick: () => setSegmentToDelete({ id, name } as Segment), hash: 'delete', icon: <DeleteIcon /> }
            ]}
            toggle={<Button iconOnly={<MoreHorizIcon color="secondary60" />} variant="subtle" />}
        />
    )

    return segmentItems
        ? <Panel>
            <H2>Segments</H2>
            <AlertsManager manager={alertsManager} />
            <Table
                columns={[
                    { header: 'Segment name', hash: 'name', render: ({ id, name }) => renderName(id, name), isSortable: true },
                    { header: 'Action', hideHeader: true, hash: 'id', render: ({ id, name }) => renderAction(id, name) },
                ]}
                items={segmentItems ? segmentItems : []}
                itemName="Segments"
                stickyHeader
            />
            {adding
                ? <CreateSegment
                    encodedContext={encodedContext}
                    onCancel={() => setAdding(false)}
                    mutateSegments={mutateSegments}
                    addAlert={alertsManager.add}
                />
                : <Button marginTop="medium" iconLeft={<AddIcon />} onClick={() => setAdding(true)}>Add New Segment</Button>
            }
            <Modal
                isOpen={segmentToDelete ? true : false}
                actions={[
                    { text: "Cancel", variant: "subtle", onClick: () => setSegmentToDelete(null) },
                    { text: "Delete Segment", actionType: "destructive", iconLeft: <DeleteIcon />, onClick: () => handleDeleteSegment(), isLoading: deleting }
                ]}
                backdrop={true}
                header={`Delete ${segmentToDelete?.name}`}
            >
                <H3>Confirm Delete</H3>
                <Text>
                    Are you sure that you want to delete {segmentToDelete?.name}?
                </Text>
            </Modal>
        </Panel>
        : <Loading />
}

export default Segments