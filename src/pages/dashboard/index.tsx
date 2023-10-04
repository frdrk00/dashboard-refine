import { Stack, Box, Typography } from '@mui/material'
import { useList } from '@refinedev/core'

import {
  PieChart,
  PropertyReferrals,
  TotalRevenue,
  PropertyCard,
  TopAgent,
} from '../../components'

const DashboardPage = () => {
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142D"></Typography>
      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        <PieChart
          title="Properties for Sale"
          value={684}
          series={[75, 25]}
          colors={['#275be8', '#c4e8ef']}
        />
        <PieChart
          title="Properties for Rent"
          value={550}
          series={[60, 40]}
          colors={['#275be8', '#c4e8ef']}
        />
        <PieChart
          title="Total customers"
          value={5684}
          series={[75, 25]}
          colors={['#275be8', '#c4e8ef']}
        />
        <PieChart
          title="Properties for Cities"
          value={555}
          series={[75, 25]}
          colors={['#275be8', '#c4e8ef']}
        />
      </Box>

      <Stack
        mt="25px"
        width="100%"
        direction={{
          xs: 'column',
          lg: 'row',
        }}
      >
        <TotalRevenue />
        <PropertyReferrals />
      </Stack>
    </Box>
  )
}

export default DashboardPage
