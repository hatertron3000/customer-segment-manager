import { Button, Dropdown, Panel, Link as StyledLink, Table } from "@bigcommerce/big-design"
import Link from 'next/link';
import { MoreHorizIcon, AddIcon, DeleteIcon } from '@bigcommerce/big-design-icons';
import Loading from "@components/loading"
import { useSegments } from "@lib/hooks"
import { ReactElement } from "react"
import { Segment } from "types/segment"
import { useRouter } from 'next/router';
import { SegmentTableItem } from "types/data";

const Segments = () => {
    const router = useRouter();
    const {
        data,
        meta,
        isLoading,
        error,
        mutateSegments,
    } = useSegments()


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
    );

    const renderAction = (id: string): ReactElement => (
        <Dropdown
            items={[ 
                { content: 'Edit Shopper Profiles', onItemClick: () => router.push(`/segments/${id}/shopper-profiles`), hash: 'edit' },
                { content: 'Delete Segment', onItemClick: () => window.alert('TODO: Implement confirmation modal + deletion'), hash: 'delete', icon: <DeleteIcon />}
            ]}
            toggle={<Button iconOnly={<MoreHorizIcon color="secondary60" />} variant="subtle" />}
        />
    );

    return segmentItems 
        ? <Panel>
            <Table
                columns={[
                    { header: 'Segment name', hash: 'name', render: ({ id, name }) => renderName(id, name), isSortable: true },
                    { header: 'Action', hideHeader: true, hash: 'id', render: ({ id }) => renderAction(id) },
                ]}
                items={segmentItems ? segmentItems : []}
                itemName="Segments"
                stickyHeader
            />
            <Button marginTop="medium" iconLeft={<AddIcon />} onClick={() => router.push('/segments/create')}>Add New Segment</Button>
          </Panel>
        : <Loading />
}

export default Segments