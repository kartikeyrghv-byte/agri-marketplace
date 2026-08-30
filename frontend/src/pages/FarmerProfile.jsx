import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

function FarmerProfile() {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [farmerRes, productsRes, reviewsRes] = await Promise.all([
        API.get(`/auth/farmer/${id}`),
        API.get(`/products/farmer/${id}`),
        API.get(`/reviews/farmer/${id}`)
      ]);
      setFarmer(farmerRes.data);
      setProducts(productsRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching farmer profile:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [id]);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;
  if (!farmer) return <p style={{ textAlign: 'center' }}>Farmer not found.</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h2>{farmer.name}</h2>
        <p><strong>Email:</strong> {farmer.email}</p>
        {farmer.farmLocation && <p><strong>Farm Location:</strong> {farmer.farmLocation}</p>}
        {farmer.cropTypes?.length > 0 && (
          <p><strong>Crops Grown:</strong> {farmer.cropTypes.join(', ')}</p>
        )}
        {farmer.farmingMethod && <p><strong>Farming Method:</strong> {farmer.farmingMethod}</p>}
        <p><strong>Status:</strong> {farmer.isVerified ? '✅ Verified' : '⏳ Pending Verification'}</p>
      </div>

      <h3>Products by {farmer.name}</h3>
      {products.length === 0 ? (
        <p>No products listed yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {products.map((product) => (
            <div key={product._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px' }}>
              <h4>{product.name}</h4>
              <p><strong>Price:</strong> ₹{product.price} / {product.unit}</p>
              <p><strong>Available:</strong> {product.quantity} {product.unit}</p>
              {product.organic && <p style={{ color: 'green' }}>🌱 Organic</p>}
            </div>
          ))}
        </div>
      )}
      <h3 style={{ marginTop: '30px' }}>Reviews</h3>
{reviews.length === 0 ? (
  <p>No reviews yet.</p>
) : (
  reviews.map((review) => (
    <div key={review._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
      <p><strong>{review.consumer?.name}</strong> rated {review.product?.name}: {'⭐'.repeat(review.rating)}</p>
      {review.comment && <p>{review.comment}</p>}
    </div>
  ))
)}
    </div>
  );
}

export default FarmerProfile;