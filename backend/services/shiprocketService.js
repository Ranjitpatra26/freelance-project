const axios = require('axios');

/**
 * Shiprocket API Service
 * Handles all Shiprocket API interactions for order fulfillment
 */

const SHIPROCKET_API_BASE = process.env.SHIPROCKET_API_BASE || 'https://apiv2.shiprocket.in/v1/external/';
const SHIPROCKET_API_KEY = process.env.SHIPROCKET_API_KEY;
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

// Store token (in production, use Redis for token management)
let authToken = null;
let tokenExpiry = null;

/**
 * Generate or refresh authentication token from Shiprocket
 */
const getAuthToken = async () => {
    try {
        // Return existing token if still valid
        if (authToken && tokenExpiry && tokenExpiry > Date.now()) {
            return authToken;
        }

        const response = await axios.post(`${SHIPROCKET_API_BASE}auth/login`, {
            email: SHIPROCKET_EMAIL,
            password: SHIPROCKET_PASSWORD
        });

        authToken = response.data.token;
        // Token valid for 24 hours, refresh after 20 hours
        tokenExpiry = Date.now() + (20 * 60 * 60 * 1000);

        console.log('Shiprocket auth token generated successfully');
        return authToken;
    } catch (error) {
        console.error('Shiprocket authentication failed:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Shiprocket');
    }
};

/**
 * Create a shipment in Shiprocket
 */
const createShipment = async (orderData) => {
    try {
        const token = await getAuthToken();

        const shipmentPayload = {
            order_id: orderData.orderId,
            order_date: new Date(orderData.createdAt).toISOString().split('T')[0],
            pickup_location_id: process.env.SHIPROCKET_PICKUP_LOCATION_ID || 1,
            channel_id: process.env.SHIPROCKET_CHANNEL_ID || 0,
            comment: `Order #${orderData.orderId} - Food Delivery`,
            billing_customer_name: orderData.shippingAddress.fullName,
            billing_email: orderData.userEmail || 'customer@sudhaeats.com',
            billing_phone: orderData.shippingAddress.phone,
            billing_address: orderData.shippingAddress.addressLine1,
            billing_address_2: orderData.shippingAddress.addressLine2 || '',
            billing_city: orderData.shippingAddress.city,
            billing_state: orderData.shippingAddress.state,
            billing_country: 'India',
            billing_pincode: orderData.shippingAddress.pincode,
            shipping_is_default: true,
            shipping_customer_name: orderData.shippingAddress.fullName,
            shipping_email: orderData.userEmail || 'customer@sudhaeats.com',
            shipping_phone: orderData.shippingAddress.phone,
            shipping_address: orderData.shippingAddress.addressLine1,
            shipping_address_2: orderData.shippingAddress.addressLine2 || '',
            shipping_city: orderData.shippingAddress.city,
            shipping_state: orderData.shippingAddress.state,
            shipping_country: 'India',
            shipping_pincode: orderData.shippingAddress.pincode,
            order_items: orderData.items.map(item => ({
                name: item.name,
                sku: item.product,
                units: item.quantity,
                selling_price: item.price,
                discount: 0,
                tax: 0,
                hsn_code: '',
                sac_code: '',
                barcode_value: ''
            })),
            payment_method: 'Prepaid',
            sub_total: orderData.itemsPrice,
            length: 15,
            breadth: 15,
            height: 15,
            weight: 2
        };

        const response = await axios.post(
            `${SHIPROCKET_API_BASE}shipments/create/adhoc`,
            shipmentPayload,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.status_code === 1) {
            console.log(`Shipment created successfully for order ${orderData.orderId}`);
            return {
                success: true,
                shipmentId: response.data.shipment_id,
                awb: response.data.shipment_gj_awb || response.data.awb,
                carrier: response.data.carrier_name,
                data: response.data
            };
        } else {
            throw new Error(response.data.message || 'Failed to create shipment');
        }
    } catch (error) {
        console.error('Error creating shipment:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

/**
 * Get shipment tracking details
 */
const getShipmentTracking = async (shipmentId) => {
    try {
        const token = await getAuthToken();

        const response = await axios.get(
            `${SHIPROCKET_API_BASE}shipments/${shipmentId}/track`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data.status_code === 1) {
            const tracking = response.data.data || response.data;
            return {
                success: true,
                shipmentId: tracking.shipment_id,
                awb: tracking.awb,
                status: tracking.status,
                statusCode: tracking.status_code,
                carrier: tracking.carrier_name,
                estimatedDeliveryDate: tracking.edd,
                currentLocation: tracking.current_location,
                trackingData: tracking.track_list || [],
                isDelivered: tracking.status === 'Delivered' || tracking.status === 'delivered'
            };
        } else {
            throw new Error(response.data.message || 'Failed to fetch tracking');
        }
    } catch (error) {
        console.error('Error fetching tracking:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

/**
 * Generate manifesto for multiple shipments
 */
const generateManifesto = async (shipmentIds) => {
    try {
        const token = await getAuthToken();

        const response = await axios.post(
            `${SHIPROCKET_API_BASE}manifests/generate`,
            { shipment_ids: shipmentIds },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data.status_code === 1) {
            return {
                success: true,
                manifestId: response.data.manifest_id,
                url: response.data.manifest_url,
                data: response.data
            };
        } else {
            throw new Error(response.data.message || 'Failed to generate manifesto');
        }
    } catch (error) {
        console.error('Error generating manifesto:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

/**
 * Request pickup for shipments
 */
const requestPickup = async (shipmentId) => {
    try {
        const token = await getAuthToken();

        const response = await axios.post(
            `${SHIPROCKET_API_BASE}pickups/request`,
            { shipment_id: shipmentId },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data.status_code === 1) {
            return {
                success: true,
                pickupId: response.data.pickup_request_id,
                data: response.data
            };
        } else {
            throw new Error(response.data.message || 'Failed to request pickup');
        }
    } catch (error) {
        console.error('Error requesting pickup:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

/**
 * Map Shiprocket status to order status
 */
const mapShiprocketStatusToOrderStatus = (shiprocketStatus) => {
    const statusMap = {
        'Confirmed': 'Processing',
        'Processed': 'Processing',
        'Picked': 'Shipped',
        'Shipped': 'Shipped',
        'Out for Delivery': 'Out for Delivery',
        'Delivered': 'Delivered',
        'Cancelled': 'Cancelled',
        'RTO': 'Cancelled',
        'Lost': 'Cancelled',
        'Damaged': 'Cancelled'
    };

    return statusMap[shiprocketStatus] || 'Processing';
};

/**
 * Cancel shipment
 */
const cancelShipment = async (shipmentId) => {
    try {
        const token = await getAuthToken();

        const response = await axios.post(
            `${SHIPROCKET_API_BASE}shipments/${shipmentId}/cancel`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data.status_code === 1) {
            return {
                success: true,
                message: 'Shipment cancelled successfully',
                data: response.data
            };
        } else {
            throw new Error(response.data.message || 'Failed to cancel shipment');
        }
    } catch (error) {
        console.error('Error cancelling shipment:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

module.exports = {
    createShipment,
    getShipmentTracking,
    generateManifesto,
    requestPickup,
    cancelShipment,
    mapShiprocketStatusToOrderStatus,
    getAuthToken
};
