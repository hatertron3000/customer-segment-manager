import { AlertsManager,
    createAlertsManager,
    AlertProps,
    Button,
    Dropdown,
    Panel,
    Link as StyledLink,
    Table,
    Modal,
    H3,
    Text } from "@bigcommerce/big-design"
import Link from 'next/link'
import { useState } from "react"
import CreateSegment from '../../components/createSegment'
import { useSession } from "context/session"
import { MoreHorizIcon, AddIcon, DeleteIcon } from '@bigcommerce/big-design-icons'
import Loading from "@components/loading"
import { useSegments } from "@lib/hooks"
import { ReactElement } from "react"
import { Segment } from "types/segment"
import { useRouter } from 'next/router'
import { SegmentTableItem } from "types/data"

const alertsManager = createAlertsManager()

const Segments = () => {
    const [adding, setAdding] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [segmentToDelete, setSegmentToDelete]: [Segment | null, Function] = useState(null)
    const router = useRouter()
    const {
        data,
        meta,
        isLoading,
        error,
        mutateSegments,
    } = useSegments()
    const encodedContext = useSession()?.context;

    const handleDeleteSegment = async (): Promise<void> => {
        setDeleting(true)
        try {
            const url = `/api/segments?id=${segmentToDelete.id}&context=${encodedContext}`
            await fetch(url, {
                method: 'DELETE'
            })
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
        } catch(err) {
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

    const segmentItems: SegmentTableItem[] = data?.map(({id, name}: Segment) => (
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
                { content: 'Edit Shopper Profiles', onItemClick: () => router.push(`/segments/${id}/shopper-profiles`), hash: 'edit' },
                { content: 'Delete Segment', onItemClick: () => setSegmentToDelete({id, name} as Segment), hash: 'delete', icon: <DeleteIcon />}
            ]}
            toggle={<Button iconOnly={<MoreHorizIcon color="secondary60" />} variant="subtle" />}
        />
    )

    return segmentItems 
        ? <Panel>
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
                    { text: "Delete Segment", actionType: "destructive", iconLeft: <DeleteIcon />, onClick: () => handleDeleteSegment(), isLoading: deleting}
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