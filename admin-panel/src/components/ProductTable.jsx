// const ProductTable = ({ products }) => {
//   return (
//     <table className="product-table" border="1" cellPadding="10" cellSpacing="0">
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>SKU</th>
//           <th>Category</th>
//           <th>Price</th>
//           <th>Material</th>
//           <th>Plating</th>
//           <th>Weight</th>
//           <th>Dimensions</th>
//           <th>Description</th>
//           <th>Image</th>
//         </tr>
//       </thead>

//       <tbody>
//         {products.map((p) => (
//           <tr key={p._id}>
//             <td>{p.name}</td>
//             <td>{p.sku}</td>
//             <td>{p.category}</td>
//             <td>₹{p.price}</td>
//             <td>{p.material}</td>
//             <td>{p.plating}</td>
//             <td>{p.weight}</td>
//             <td>
//               {p.dimensions?.length} x {p.dimensions?.width} cm
//             </td>
//             <td>{p.description}</td>
//             <td>
//               {p.images && p.images.length > 0 ? (
//                 <img
//                   src={p.images[0]}
//                   alt={p.name}
//                   style={{ width: "50px", height: "50px", objectFit: "cover" }}
//                 />
//               ) : (
//                 "No Image"
//               )}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default ProductTable;

