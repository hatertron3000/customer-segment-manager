import { Panel } from "@bigcommerce/big-design"
import { useSegments } from "@lib/hooks"
import { Segment } from "types/segment"

const Segments = () => {
    const {
        data,
        meta,
        isLoading,
        error,
        mutateSegments,
    } = useSegments()


    const segmentItems = data?.map((segment: Segment, i) => (
        <div key={i}>{segment.name}</div>
    ))

    return <Panel>
        <div>Hello world</div>
        { segmentItems }
    </Panel>
}

export default Segments