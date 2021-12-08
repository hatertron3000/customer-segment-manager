import {
        Panel,
        H2,
        Form,
        Input,
        FormGroup,
        Button,
        Box,
        H3,
        AlertsManager,
        AlertProps,
        createAlertsManager,
        Table,
        Link as StyledLink
    } from "@bigcommerce/big-design"
import Link from 'next/link'
import { CustomerItem } from "@types"
import { SearchIcon, EditIcon } from "@bigcommerce/big-design-icons"
import { useState } from "react"
import { useSession } from "context/session"

const alertsManager = createAlertsManager()

const Customers = () => {
    const encodedContext = useSession()?.context
    const [loading, setLoading] = useState(false)
    const [customers, setCustomers] = useState([])
    const [name,  setName] = useState('')

    const customerItems = customers?.map(({
        id,
        email,
        first_name,
        last_name,
        shopper_profile_id = null,
        segment_ids = []
    }) => ({
        id,
        email,
        first_name,
        last_name,
        shopper_profile_id,
        segment_ids
    } as CustomerItem))

    const handleSearch = async () => {
        setLoading(true)
        try {
            const query = `name:like=${name}&context=${encodedContext}`
            const url = `/api/customers?${query}`
            const res =  await fetch(url)
            const { data } = await res.json()
            setCustomers(data)
            if(data.length === 0) {
                const alert = {
                    type: 'warning',
                    header: 'No results',
                    messages: [
                        {
                            text: `No results for ${name}`
                        }
                    ],
                    autoDismiss: true
                } as AlertProps
                alertsManager.add(alert)
            }
        } catch(error) {
            console.error(error)
            const alert = {
                type: 'error',
                header: 'Error searching customers',
                messages: [
                    {
                        text: error.message
                    }
                ],
                autoDismiss: true
            } as AlertProps
            alertsManager.add(alert)
        }
        setLoading(false)
    }

    const renderName = ({id, first_name, last_name }) => {
        return <Link href={`/customers/${id}`}>
            <StyledLink><EditIcon size="medium"/>&nbsp;{first_name} {last_name}</StyledLink>
        </Link>
    }

    const SearchResults = ({ customers, setCustomers }) => (
        <Box>
            <H3>Search Results</H3>
            <Table
                columns={[
                    { header: 'Name', hash: 'name', render: ({ id, first_name, last_name }) => renderName({ id, first_name, last_name })},
                    { header: 'Email', hash: 'email', render: (({email}) => email)},
                    { header: 'Segments', hash: 'segmentCount', render: (({segment_ids}) => segment_ids.length)},
                ]}
                items={customerItems}
            />
        </Box>
    )


    return <Panel>
        <AlertsManager manager={alertsManager} />
        <H2>Customers</H2>
        <Form>
            <FormGroup>
                <Input 
                    label="Search by name"
                    placeholder="John Doe"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </FormGroup>
            <Button 
                    iconLeft={<SearchIcon />}
                    onClick={e => {
                        e.preventDefault()
                        handleSearch()
                    }}
                    isLoading={loading}
                >
                    Search
            </Button>
        </Form>
        {customers?.length 
            ? <SearchResults customers={customers} setCustomers={setCustomers} />
            : null
            }
    </Panel>
}

export default Customers