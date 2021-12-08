import { useRouter } from 'next/router'
import { useSegments, useCustomer } from '@lib/hooks'
import {
        H2,
        H3,
        Panel,
        Link as StyledLink,
        Box,
        Text,
        Switch,
        Flex,
        FlexItem,
        AlertsManager, AlertProps, createAlertsManager
    } from '@bigcommerce/big-design'
import { ArrowBackIcon } from '@bigcommerce/big-design-icons'
import Loading from '@components/loading'
import Link from 'next/link'
import { useSession } from 'context/session'
import { useState } from 'react'

const alertsManager = createAlertsManager()

const CustomerEditor = () => {
    const encodedContext = useSession()?.context;
    const router = useRouter()
    const id = router.query.id as string
    const {
        segments,
        segmentMeta,
        segmentsLoading,
        segmentError,
        mutateSegments,
    } = useSegments({page: "1", limit: "250"})

    const {
        customer,
        customerMeta,
        customerLoading,
        customerError,
        mutateCustomer,
    } = useCustomer(id)

    const [disabled, setDisabled] = useState(false)

    
    
    const addToSegment = async (segmentId) => {
        console.log('adding')
        try {
            const url = `/api/segments/${segmentId}/shopper-profiles?context=${encodedContext}`
            const options = {
                method: 'POST',
                body: JSON.stringify([ customer.shopper_profile_id ])
            }
            const res = await fetch(url, options)
            const { data } = await res.json()
            if(!data || data.length < 1) {
                throw new Error('Unable to add the shopper profile to the segment')
            }
            const alert = {
                type: 'success',
                header: 'Added to segment',
                messages: [
                    {
                        text: `Added to ${segments.find(segment => segment.id === segmentId).name}`
                    }
                ],
                autoDismiss: true
            } as AlertProps
            alertsManager.add(alert)
            mutateCustomer()
        } catch (err) {
            console.error(err)
            const alert = {
                type: 'error',
                header: 'Error adding customer to segment',
                messages: [
                    {
                        text: err.message
                    }
                ]
            } as AlertProps
            alertsManager.add(alert)
            mutateCustomer()
        }
    }

    const removeFromSegment = async (segmentId) => {
        console.log('removing')
        try {
            const url = `/api/segments/${segmentId}/shopper-profiles?context=${encodedContext}&ids=${customer.shopper_profile_id}`
            const options = {
                method: 'DELETE',
            }
            const res = await fetch(url, options)
            const { meta } = await res.json()
            if(!meta || meta.success < 1) {
                throw new Error('Unable to remove the shopper profile from the segment')
            }
            const alert = {
                type: 'success',
                header: 'Removed from segment',
                messages: [
                    {
                        text: `Removed the shopper profile from ${segments.find(segment => segment.id === segmentId).name}`
                    }
                ],
                autoDismiss: true
            } as AlertProps
            alertsManager.add(alert)
            mutateCustomer()
        } catch (err) {
            console.error(err)
            const alert = {
                type: 'error',
                header: 'Error removing customer from segment',
                messages: [
                    {
                        text: err.message
                    }
                ]
            } as AlertProps
            alertsManager.add(alert)
            mutateCustomer()
        }
    }

    const provisionShopperProfile = async () => {
        const url = `/api/shopper-profiles?context=${encodedContext}`
        const body = JSON.stringify([
            {
                customer_id: customer.id
            }
        ])
        const options = {
            method: 'POST',
            body
        }
        try {
            await fetch(url, options)
            mutateCustomer()
            const alert = {
                type: 'info',
                header: 'Provisioned customer profile',
                messages: [
                    {
                        text: `No customer profile existed for ${customer.email}, so one has been created automatically.`
                    }
                ]
            } as AlertProps
            alertsManager.add(alert)
        } catch (error) {
            console.error(error)
            const alert = {
                type: 'error',
                header: 'Error provisioning customer profile',
                messages: [
                    {
                        text: error.message
                    }
                ]
            } as AlertProps
            alertsManager.add(alert)
        }
    }
    
    if(customer && !customer.shopper_profile_id) {
        provisionShopperProfile()
    }
    
    return customer && customer.shopper_profile_id && segments
    ? <Panel>
        <AlertsManager manager={alertsManager} />
        <Box marginBottom="medium">
            <Link href="/customers">
                    <StyledLink>
                    <ArrowBackIcon />
                    Back to Customers
                </StyledLink>
            </Link>
        </Box>
        <H2>Edit Segments for {customer.email}</H2>
        <Box>
            {segments.map(segment => (<Flex marginBottom="medium">
                <FlexItem>
                    <Switch 
                        disabled={disabled}
                        checked={customer.segment_ids?.includes(segment.id)}
                        onChange={async (e) => {
                            setDisabled(true)
                            if (!e.target.checked)
                                await removeFromSegment(segment.id)
                            else
                                await addToSegment(segment.id)
                            setDisabled(false)
                        }}
                    />
                </FlexItem>
                <FlexItem marginLeft="large">
                    <Text>{segment.name}</Text>
                </FlexItem>
                </Flex>
            ))}
        </Box>
    </Panel>
    : <Panel>
        <AlertsManager manager={alertsManager} />
        <Loading />
      </Panel>
}

export default CustomerEditor