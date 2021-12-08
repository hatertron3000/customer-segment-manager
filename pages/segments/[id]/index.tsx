import {
    AlertProps,
    AlertsManager,
    Box,
    createAlertsManager,
    H2,
    Panel,
    Link as StyledLink,
} from '@bigcommerce/big-design'
import { ArrowBackIcon } from '@bigcommerce/big-design-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Loading from '@components/loading'
import SegmentEditor from '@components/segmentEditor'
import { useSegments, } from '@lib/hooks'
import { useSession } from 'context/session'

const alertsManager = createAlertsManager()

const Segment = () => {
    const encodedContext = useSession()?.context
    const router = useRouter()
    const segmentId = router.query.id
    const {
        segments,
        // segmentMeta,
        // segmentsLoading,
        // segmentError,
        mutateSegments,
    } = useSegments({ "id:in": segmentId })

    const onCancel = () => {
        router.push('/')
    }

    const onSave = async ({ name, description }) => {
        try {
            const body = JSON.stringify([
                {
                    id: segments[0].id,
                    name,
                    description,
                }
            ]),
                options = {
                    method: 'PUT',
                    body,
                    headers: {
                        "content-type": "application/json"
                    }
                },
                url = `/api/segments?context=${encodedContext}`

            const res = await fetch(url, options)
            const data = await res.json()
            if (res.status != 200) {
                throw new Error(`Error saving segment${data.message ? `: ${data.message}` : ''}`)
            }
            const alert = {
                header: 'Success',
                autoDismiss: true,
                messages: [
                    {
                        text: `Saved segment: ${name}`
                    }
                ],
                type: 'success',
                onClose: () => null,
            } as AlertProps
            alertsManager.add(alert)
            await mutateSegments()
        } catch (err) {
            console.error(err)
            const alert = {
                header: 'Error saving segment',
                messages: [
                    {
                        text: err.message
                    }
                ],
                type: 'error',
                onClose: () => null,
            } as AlertProps
            alertsManager.add(alert)
        }
    }

    return !segments
        ? <Loading />
        : <Panel>
            <Box marginBottom="medium">
                <AlertsManager manager={alertsManager} />
                <Link href="/">
                    <StyledLink>
                        <ArrowBackIcon />
                        Back to Segments
                    </StyledLink>
                </Link>
            </Box>
            <H2>Edit {segments[0].name}</H2>
            <SegmentEditor
                onSave={onSave}
                onCancel={onCancel}
                saveText={'Save Segment'}
                segment={segments[0]}
            />
        </Panel>
}

export default Segment